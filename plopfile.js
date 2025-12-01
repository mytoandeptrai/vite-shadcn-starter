const generateComponent = {
  type: "add",
  path: "src/{{path}}/{{kebabCase name}}/{{kebabCase name}}.tsx",
  templateFile: "plop-templates/components/Component.tsx.hbs",
};
const generateIndex = {
  type: "add",
  path: "src/{{path}}/{{kebabCase name}}/index.ts",
  templateFile: "plop-templates/components/index.ts.hbs",
};
const questions = {
  componentName: {
    type: "input",
    name: "name",
    message: "What is your component name?",
  },
  path: {
    type: "input",
    name: "path",
    message: "Where should it be generated? (/src/{{YOUR_PATH}})",
  },
};

export default (plop) => {
  plop.setGenerator("component", {
    description: "Create a component",
    prompts: [questions.componentName, questions.path],
    actions: [generateComponent, generateIndex],
  });
};
