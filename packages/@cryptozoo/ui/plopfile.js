module.exports = (plop) => {
  plop.setGenerator('FragC', {
    description: 'Create a reusable Fragment Component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is your component name?',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.tsx',
        templateFile: 'plop-templates/Component/Component.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.stories.tsx',
        templateFile: 'plop-templates/Component/Component.stories.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{pascalCase name}}/index.ts',
        templateFile: 'plop-templates/Component/index.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/components/index.tsx',
        templateFile: 'plop-templates/injectable-index.tsx.hbs',
        skipIfExists: true,
      },
      {
        type: 'append',
        path: 'src/components/index.tsx',
        pattern: `/* PLOP_INJECT_EXPORT */`,
        template: `export * from './{{pascalCase name}}';`,
      },
    ],
  });
};
