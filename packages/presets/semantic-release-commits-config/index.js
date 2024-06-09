module.exports = {
    branches: ['master', 'main'],
    plugins: [
        [
            '@semantic-release/commit-analyzer',
            {
                preset: 'conventionalcommits',
                releaseRules: [
                    { breaking: true, release: 'major' },
                    {
                        type: 'feat',
                        release: 'minor',
                    },
                    {
                        type: 'fix',
                        release: 'patch',
                    },
                    {
                        type: 'chore',
                        release: false,
                    },
                    {
                        type: 'refactor',
                        release: 'patch',
                    },
                    {
                        type: 'docs',
                        release: 'patch',
                    },
                    {
                        type: 'perf',
                        release: 'patch',
                    },
                    {
                        type: 'test',
                        release: 'patch',
                    },
                    {
                        scope: 'no-release',
                        release: false,
                    },
                ],
            },
        ],
        [
            '@semantic-release/release-notes-generator',
            {
                preset: 'conventionalcommits',
                presetConfig: {
                    types: [
                        {
                            type: 'feat',
                            section: 'Features',
                        },
                        {
                            type: 'fix',
                            section: 'Fixes',
                        },
                        {
                            type: 'chore',
                            section: 'Other',
                        },
                        {
                            type: 'docs',
                            section: 'Documentation',
                        },
                        {
                            type: 'style',
                            section: 'UI',
                        },
                        {
                            type: 'refactor',
                            section: 'Refactoring',
                        },
                        {
                            type: 'perf',
                            section: 'Performance Improvements',
                        },
                        {
                            type: 'test',
                            section: 'Testing',
                        },
                    ],
                },
            },
        ],
    ],
}
