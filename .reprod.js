module.exports = ({version}) => ({
    package: {
        dependencies: {
            'repro': version,
        },
    },
    files: [
        {
            path: 'repro',
            permissions: 0o775,
            content: `#!/bin/sh
# Place your reproduction steps here

./node_modules/.bin/repro $@`
        },
    ]
})
