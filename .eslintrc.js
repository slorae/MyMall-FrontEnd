module.exports = {
  'extends': "airbnb-base",
  "parser": "babel-eslint",
  "plugins": [
    "flowtype"
  ],
  "rules": {
    "flowtype/require-parameter-type": 1,
    "flowtype/require-return-type": [
      0,
      "always",
      {
        "annotateUndefined": "never"
      }
    ],
    "flowtype/space-after-type-colon": [
      0,
      "always"
    ],
    "flowtype/space-before-type-colon": [
      0,
      "never"
    ],
    "flowtype/type-id-match": [
      1,
      "^([A-Z][a-z0-9]+)+Type$"
    ]
  },
  "settings": {
    "flowtype": {
      "onlyFilesWithFlowAnnotation": true,
    }
  },
  'globals': {
    'angular': true
  },
};
