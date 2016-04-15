export default {
  "values": {
    "currentFlowId": "F001",
    "flowStack": [],
    "inputValues": {}
  },
  "defs": {
    "title": "sample enquete",
    "creator": "Jiro Corporation",
    "version": 1,
    "draftDefs": [
      {
        "pageId": "P001",
        "yaml": "title: Checkbox\nquestions:\n  - type: checkbox\n    choices:\n      - 選択肢1\n      - label: 選択肢2\n        value: ABC\n      - '<span style=\"color: red;\">HTML</span>' # コロンを含む文字列を指定する場合\n      - | # 複数行記載する場合\n        1行目\n        2行目\n",
        "valid": true
      },
      {
        "pageId": "P002",
        "yaml": "title: 初めてパソコンについてお伺いします\nquestions:\n  - type: checkbox\n    labels:\n      - 選択肢1\n      - 選択肢2\n      - 選択肢3\n    values:\n      - 1\n      - 2\n      - 3\n  - type: checkbox\n    labels:\n      - 選択肢1\n      - 選択肢2\n      - 選択肢3\n    values:\n      - 1\n      - 2\n      - 3",
        "valid": true
      }
    ],
    "positionDefs": [
      {
        "flowId": "F001",
        "x": 306.25,
        "y": 640.5
      },
      {
        "flowId": "F002",
        "x": 306.25,
        "y": 854
      }
    ],
    "pageDefs": [
      {
        "id": "P002",
        "title": "初めてパソコンについてお伺いします",
        "questions": [
          {
            "type": "checkbox",
            "labels": [
              "選択肢1",
              "選択肢2",
              "選択肢3"
            ],
            "values": [
              1,
              2,
              3
            ]
          },
          {
            "type": "checkbox",
            "labels": [
              "選択肢1",
              "選択肢2",
              "選択肢3"
            ],
            "values": [
              1,
              2,
              3
            ]
          }
        ]
      },
      {
        "title": "Checkbox",
        "questions": [
          {
            "type": "checkbox",
            "choices": [
              "選択肢1",
              {
                "label": "選択肢2",
                "value": "ABC"
              },
              "<span style=\"color: red;\">HTML</span>",
              "1行目\n2行目\n"
            ]
          }
        ],
        "id": "P001"
      }
    ],
    "conditionDefs": [],
    "flowDefs": [
      {
        "id": "F001",
        "type": "page",
        "pageId": "P001",
        "nextFlowId": "F002"
      },
      {
        "id": "F002",
        "type": "page",
        "pageId": "P002",
        "nextFlowId": null
      }
    ]
  },
  "viewSettings": {
    "graphWidth": 1066.99658203125,
    "hotHeight": 400
  }
}
