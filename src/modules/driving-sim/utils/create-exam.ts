import type { CarSnapshot, ExamEvent, Scenario } from '../types';
import { type Exam, HillExam, ParkingExam } from './exam';
import { RoadExam } from './road-exam';
import { YardExam } from './yard-exam';

/** Free roam: nothing is scored. */
class FreeRoam implements Exam {
  private elapsed = 0;

  update(_car: CarSnapshot, dt: number): ExamEvent[] {
    this.elapsed += dt;
    return [];
  }

  clock() {
    return { seconds: this.elapsed, countdown: false };
  }

  hint(): string {
    return 'Tập lái tự do — không chấm điểm';
  }
}

export function createExam(scenario: Scenario): Exam {
  if (scenario === 'hill') return new HillExam();
  if (scenario === 'parking') return new ParkingExam();
  if (scenario === 'exam') return new YardExam();
  if (scenario === 'road') return new RoadExam();
  return new FreeRoam();
}
