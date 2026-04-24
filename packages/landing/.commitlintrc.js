module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
        'Feature', // Allow "Feature" as a type
        'feature', // Allow "feature" as a type
        'Bugfix',
        'bugfix',
        'Hotfix',
        'hotfix',
        'Release',
        'release',
      ],
    ],
    'subject-case': [0], // Disable subject case checking
    'subject-empty': [0], // Disable subject empty checking
    'type-empty': [0], // Disable type empty checking
    'header-max-length': [0], // Disable header max length
  },
}
