module.exports = (plop) => {
  plop.setHelper('upperCase', (txt) => txt.toUpperCase());

  plop.setGenerator('Component', {
    description: 'Create a reusable Component',
    prompts: [
      {
        type: 'list',
        name: 'type',
        message: 'What is your component type?',
        choices: ['Base', 'Fragment', 'Query'],
      },
      {
        type: 'input',
        name: 'name',
        message: 'What is your component name?',
      },
    ],
    actions: function (data) {
      const componentAction = (template) => {
        return {
          type: 'add',
          path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.tsx',
          templateFile: `plop-templates/Component/${template}`,
        };
      };

      const actions = [
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
      ];

      switch (data.type) {
        case 'Base':
          actions.push(componentAction('Component.tsx.hbs'));
          break;
        case 'Fragment':
          actions.push(componentAction('FragComponent.tsx.hbs'));
          break;
        case 'Query':
          actions.push(componentAction('QueryComponent.tsx.hbs'));
          break;
      }

      return actions;
    },
  });
};
