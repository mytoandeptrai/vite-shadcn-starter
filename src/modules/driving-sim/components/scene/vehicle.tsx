import { useFrame } from '@react-three/fiber';
import {
  CuboidCollider,
  type RapierRigidBody,
  RigidBody,
  useAfterPhysicsStep,
  useBeforePhysicsStep,
  useRapier,
} from '@react-three/rapier';
import { useEffect, useMemo, useRef } from 'react';
import type { Group } from 'three';
import { CAR, SPAWNS } from '../../constants';
import { notifyStall, useSimStore } from '../../store/sim-store';
import { updateEngineSound } from '../../utils/audio';
import { coachTip } from '../../utils/coach';
import { stepDrivetrain } from '../../utils/drivetrain';
import { createExam } from '../../utils/exam';
import { input, updateInput } from '../../utils/input-state';
import { runtime } from '../../utils/runtime';
import { SUSPENSION, VehicleRig, WHEEL_ANCHORS } from '../../utils/vehicle-physics';
import { CarModel } from './car-model';

/** Ride height of the chassis origin above the ground when settled. */
const RIDE_HEIGHT = 0.62;
const TELEMETRY_INTERVAL = 0.1;
/** Forward-vector rise above which the car counts as standing on a slope (the hill is 10%). */
const UPHILL_PITCH = 0.04;

export function Vehicle() {
  const scenario = useSimStore((s) => s.scenario);
  const { world } = useRapier();
  const bodyRef = useRef<RapierRigidBody>(null);
  const groupRef = useRef<Group>(null);
  const wheelRefs = useRef<(Group | null)[]>([]);
  const steeringWheelRef = useRef<Group>(null);
  const rigRef = useRef<VehicleRig | null>(null);
  const stalledRef = useRef(false);
  const clockRef = useRef({ time: 0, sinceTelemetry: 0 });
  const exam = useMemo(() => createExam(scenario), [scenario]);
  const spawn = SPAWNS[scenario];

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const rig = new VehicleRig(world, body);
    rigRef.current = rig;
    runtime.chassis = groupRef.current;
    runtime.pose.x = spawn.x;
    runtime.pose.z = spawn.z;
    runtime.pose.heading = spawn.heading;
    runtime.pose.speed = 0;
    runtime.npcs = exam.traffic?.cars ?? [];
    return () => {
      rig.dispose();
      rigRef.current = null;
      runtime.chassis = null;
    };
  }, [world, spawn, exam]);

  useBeforePhysicsStep((w) => {
    const rig = rigRef.current;
    if (!rig) return;
    const dt = w.timestep;
    const { transmission, gear, handbrake } = useSimStore.getState();
    updateInput(dt);

    const out = stepDrivetrain(runtime.drivetrain, {
      transmission,
      gear,
      throttle: input.throttle,
      clutch: input.clutch,
      speed: rig.speed(),
      dt,
    });
    if (out.stalled) {
      stalledRef.current = true;
      notifyStall();
    }
    rig.step(dt, {
      steer: (input.steerDeg / CAR.maxSteerWheelDeg) * CAR.maxRoadWheelRad,
      driveForce: out.driveForce,
      footBrake: input.brake,
      handbrake,
      parkLock: out.parkLock,
    });
  });

  useAfterPhysicsStep((w) => {
    const rig = rigRef.current;
    if (!rig) return;
    const dt = w.timestep;
    const clock = clockRef.current;
    clock.time += dt;

    const snapshot = rig.snapshot(stalledRef.current);
    stalledRef.current = false;
    runtime.pose.x = snapshot.position.x;
    runtime.pose.z = snapshot.position.z;
    runtime.pose.heading = Math.atan2(snapshot.forward.x, snapshot.forward.z);
    runtime.pose.speed = snapshot.speed;
    runtime.pose.wheels = snapshot.wheels;

    const store = useSimStore.getState();
    const events = exam.update(snapshot, dt, {
      transmission: store.transmission,
      gear: store.gear,
      signal: store.signal,
      handbrake: store.handbrake,
    });
    if (exam.traffic) runtime.npcs = exam.traffic.cars;
    store.applyEvents(events, clock.time);

    clock.sinceTelemetry += dt;
    if (clock.sinceTelemetry >= TELEMETRY_INTERVAL) {
      clock.sinceTelemetry = 0;
      const examClock = exam.clock();
      store.setTelemetry({
        speedKmh: Math.abs(snapshot.speed) * 3.6,
        rpm: Math.abs(runtime.drivetrain.rpm),
        clutchPct: Math.round(input.clutch * 100),
        throttlePct: Math.round(input.throttle * 100),
        brakePct: Math.round(input.brake * 100),
        clockSeconds: examClock.seconds,
        clockCountdown: examClock.countdown,
        hint: exam.hint(),
        road: exam.progress?.() ?? null,
        coach: coachTip({
          transmission: store.transmission,
          gear: store.gear,
          engineRunning: store.engineRunning,
          handbrake: store.handbrake,
          clutch: input.clutch,
          throttle: input.throttle,
          brake: input.brake,
          speedKmh: Math.abs(snapshot.speed) * 3.6,
          rpm: Math.abs(runtime.drivetrain.rpm),
          uphill: rig.forward().y > UPHILL_PITCH,
        }),
      });
    }
  });

  useFrame((_, delta) => {
    const rig = rigRef.current;
    if (!rig) return;
    const steer = (input.steerDeg / CAR.maxSteerWheelDeg) * CAR.maxRoadWheelRad;
    wheelRefs.current.forEach((wheel, i) => {
      if (!wheel) return;
      wheel.position.y = SUSPENSION.anchorY - rig.suspensionLength(i);
      wheel.rotation.set(rig.wheelRotation(i), i < 2 ? -steer : 0, 0, 'YXZ');
    });
    if (steeringWheelRef.current) steeringWheelRef.current.rotation.z = (input.steerDeg * Math.PI) / 180;
    if (runtime.shake > 0) runtime.shake = Math.max(0, runtime.shake - delta);
    const { phase, engineRunning } = useSimStore.getState();
    if (phase === 'driving') updateEngineSound(runtime.drivetrain.rpm, input.throttle, engineRunning);
  });

  return (
    <RigidBody
      ref={bodyRef}
      colliders={false}
      position={[spawn.x, RIDE_HEIGHT + 0.05, spawn.z]}
      rotation={[0, spawn.heading, 0]}
      canSleep={false}
      angularDamping={0.4}
    >
      <CuboidCollider args={[CAR.width / 2 - 0.03, 0.3, CAR.length / 2 - 0.05]} mass={CAR.mass} friction={0.4} />
      <group ref={groupRef}>
        <CarModel steeringWheelRef={steeringWheelRef} />
        {WHEEL_ANCHORS.map(([x, z], i) => (
          <group
            key={`${x}:${z}`}
            ref={(el) => {
              wheelRefs.current[i] = el;
            }}
            position={[x, SUSPENSION.anchorY - 0.22, z]}
          >
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[CAR.wheelRadius, CAR.wheelRadius, CAR.tireHalfWidth * 2, 20]} />
              <meshStandardMaterial color='#15171a' roughness={0.9} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.17, 0.17, CAR.tireHalfWidth * 2 + 0.02, 12]} />
              <meshStandardMaterial color='#c9ced6' metalness={0.6} roughness={0.35} />
            </mesh>
            <mesh>
              <boxGeometry args={[CAR.tireHalfWidth * 2 + 0.03, 0.3, 0.05]} />
              <meshStandardMaterial color='#5b6470' />
            </mesh>
          </group>
        ))}
      </group>
    </RigidBody>
  );
}
