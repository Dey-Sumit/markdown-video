import type { NestedCompositionProjectType } from "./timeline.types";

export const EMPTY_PROJECT_4: NestedCompositionProjectType = {
  id: "id-dummy",
  title: "Dummy Project",
  props: {
    layers: {
      "l-7e334c2b-e887-4a4a-9759-b4b3a3b1c157": {
        id: "l-7e334c2b-e887-4a4a-9759-b4b3a3b1c157",
        name: "Layer 1",
        liteItems: [
          {
            contentType: "image",
            id: "s-image-f295b2ca-5099-4017-99ed-8b02d493effc",
            offset: 19,
            sequenceDuration: 150,
            effectiveDuration: 150,
            sequenceType: "standalone",
            startFrame: 19,
          },
        ],
        isVisible: true,
        layerType: "normal",
      },
      "l-90998b3c-67ec-4cbe-9f57-1b140a81cd44": {
        id: "l-90998b3c-67ec-4cbe-9f57-1b140a81cd44",
        name: "Text for s-image-f295b2ca-5099-4017-99ed-8b02d493effc",
        isVisible: true,
        liteItems: [
          {
            sequenceType: "standalone",
            offset: 19,
            startFrame: 19,
            sequenceDuration: 150,
            effectiveDuration: 150,
            id: "s-text-5aa878e7-2760-472e-9c74-695040f68271",
            contentType: "text",
          },
        ],
        layerType: "normal",
      },
      "l-accb9d99-d791-49df-99a4-85d3d894c386": {
        id: "l-accb9d99-d791-49df-99a4-85d3d894c386",
        name: "Text for s-image-f295b2ca-5099-4017-99ed-8b02d493effc",
        isVisible: true,
        liteItems: [
          {
            sequenceType: "standalone",
            offset: 19,
            startFrame: 19,
            sequenceDuration: 150,
            effectiveDuration: 150,
            id: "s-image-ca1086f9-e873-4b98-affc-9c2d44126e4a",
            contentType: "image",
          },
        ],
        layerType: "normal",
      },
    },
    layerOrder: [
      "l-accb9d99-d791-49df-99a4-85d3d894c386",
      "l-90998b3c-67ec-4cbe-9f57-1b140a81cd44",
      "l-7e334c2b-e887-4a4a-9759-b4b3a3b1c157",
    ],
    sequenceItems: {
      "s-image-f295b2ca-5099-4017-99ed-8b02d493effc": {
        id: "s-image-f295b2ca-5099-4017-99ed-8b02d493effc",
        layerId: "l-7e334c2b-e887-4a4a-9759-b4b3a3b1c157",
        type: "image",
        editableProps: {
          styles: {
            container: {
              justifyContent: "center",
              alignItems: "center",
            },
            element: {
              width: "100%",
              height: "100%",
            },
          },
          positionAndDimensions: {
            top: 0,
            left: 0,
            width: 720,
            height: 1080,
          },
          imageUrl:
            "https://no-protection-bucket.s3.us-east-1.amazonaws.com/images/ronaldo.jpg?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEND%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIFezEXhmmFr9voTydL8A9MVwqLpugKGKH867wpDZatMOAiBkYg%2BnueOJJ7b3tOOZ6pRGpIuCa2PUB6fqV2QpWopoFirLAwhoEAAaDDA1ODI2NDI1MjM3MSIMgygHa3XRYFG1cR11KqgDsbad7dw9zhiux6sfDdu7xJLM0ZB1paCXajrPCLTnDfe4cAIAyQT7CaijOn7fViPDjq0bg15%2BBwl0rNtnjC9o236TpnY8bq0xFIPcPwSxwFO5MqalTDzHZyfvF4FJdtOsM8QDDf1ixQGNnbfVwaKFVqhgsIq38NxMRj6cVDYgJnIaX5VsxWiKJWFYCIEvwdI6NDEwtnqYZa%2B4Utf3HtRCG5%2F%2B9kU%2FCJMuB51W3lk0NQXvFWmAlxuMU30%2FCzv4FKdb6jtPeEImz4ckWbTg8I8mBzAB1kiszWiyT8oGY1ytTEX%2BmH1%2BWtLXgCz%2BO%2BjA6dJ4IyzL1diChDL4EZFgr9Fdex3hrli%2FW6gszJ%2BTUJ4n3qTxPsO2XfIi5tU%2F4e0P6Z2EYNc7LmFkzAy0RCAsRn3Czas%2BKT%2BxP27na1w9UornYNXRP2wt2RA%2BRH%2B1RdT2nwambuH2gUTIsUu%2BDOAB12Gh2KnrrAKeGRe97L%2BQauHBKcW08uBDrxv3VKuDoKWILwbSOh7XrS9yDDiq1gVe%2F3YYU0DpQlidkq2H%2F2DbW3D3frfM3xWZwnfiZzCrkO%2B5BjrlAnX%2BSV3zNLrLXpkt%2BRrVKHPnENKtkp3DMJB1XNPXlg5rxfxuOFTymsH%2BfKsEJPDqod787CwoHbVpo9XMjVRFvEr4h73VfyQ0lbDvlI%2BOdl%2B4lQLl4YB2xsNhh4cfkTy9vyMiqgrs780qlxd6zBEmh9aKyoTWslqiFpqPmuN5e6DLnkJamHDibflPRv11hUZfB5kDgUV5ad9OeSLtyLzP0hsblZYVMAaU902hJNx%2FWYXZZ3lFg9gfULv0bFAdKJS1ujEL6yZ2xvO7QnDtmkNQW6JwEv8Com5xEHCC9Cbvw1p7XK9FnuYKHHc2g3bDGN3%2FY1N8F2JHH1GzhxDmdY61n5wuC08wMVFAH41m5XRw6fh6Tlc1k%2FWosTCqPMkwUdP1K%2B1CbBvrLc8wshxexn6Quyr1PXOG2gAi6FV4%2FmyoIvov9%2BgFARd9IZ0b%2ByCgfEbQjALS%2Fxx%2FFFN5w01Pc%2BA5VarepP34Hw%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAQ3EGR57JV56LSLU7%2F20241118%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241118T231215Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=4052a09f820f81faa3a659ef00fac62cc4771839f8771f7057aba1c518fa5228",
        },
      },
      "s-text-5aa878e7-2760-472e-9c74-695040f68271": {
        type: "text",
        id: "s-text-5aa878e7-2760-472e-9c74-695040f68271",
        layerId: "l-90998b3c-67ec-4cbe-9f57-1b140a81cd44",
        editableProps: {
          styles: {
            container: {
              justifyContent: "center",
              alignItems: "center",
            },

            element: {},
          },
          positionAndDimensions: {
            top: 0,
            left: 0,
            width: 720,
            height: 1080,
          },
          text: "Hello World",
        },
      },
      "s-image-ca1086f9-e873-4b98-affc-9c2d44126e4a": {
        type: "image",
        id: "s-image-ca1086f9-e873-4b98-affc-9c2d44126e4a",
        layerId: "l-90998b3c-67ec-4cbe-9f57-1b140a81cd44",
        editableProps: {
          styles: {
            container: {
              justifyContent: "center",
              alignItems: "center",
            },
            element: {
              width: "100%",
              height: "100%",
            },
          },
          positionAndDimensions: {
            top: 0,
            left: 0,
            width: 720,
            height: 1080,
          },
          imageUrl:
            "https://no-protection-bucket.s3.us-east-1.amazonaws.com/images/ronaldo%20bg%20removed.png?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEND%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCICWVZHbobnppIHPf%2BEyg0%2FkmFy04pQl6iCp9bA8pXWvpAiEA1Q8DD9adWbEr0t25SbstJdf7XcvEza5fpN9R%2BfuiErkqywMIaRAAGgwwNTgyNjQyNTIzNzEiDI4hiOEgIbXAAQu0iyqoAwfzVK6AooBPXLLCLHmFTXmO88%2Fqd6r0vuDxOHvSgArDS%2BYK2Wsb9cbr5vDgOn%2BGsqD9qaETfkx4iEYdIgWH0hcVQwp%2FC94c%2FjlB%2BMMfnIhKcINIZelp01%2FZW%2B%2F8uWEB%2FxNqMjO%2FWk00xtcSNmWjSjFqETZXtdcjqb7NIS29q4B6GbOrD7FIUc4DmRm2udg20LSanv1H1pZfHt%2FpfGprN71WlMFFg6Kw9Ysbr8VKMvSGQjgpS41QzJs7y9ZixlfUKghVkh%2BrtqE9mxc7r02Y0rc%2BFABPnF%2Bz32eTWLCz6T6vVWxxpJlIf%2F52wUZGgSLn6rF4wHzK%2BU4E4vfJvwV0wDwuKKkg6WMHIdM8JF3guDkjrMUTZgvMD5axYV4i5rqnj1JMDUAfZZO2D4Nee6%2FoFahpmeL4qGoWrzuDwd%2BScMzfj%2BAJlN%2BQM3ppHGZFpykRDKxQQrZXb8dhB97KeqYeWnnxxCOMzINKBj1A8iCW70D386CEhTp7QolAGJplQOLUpv5tChJgP1PrzssufUvsCUM6JZ7%2BX2YNAssg3qu%2Bh%2BPErIke9mrsQx4wq5DvuQY65ALTw7x0s7YSRgK79fq1BvAwQwMlDq2IVByvHGU33bYW0BrafdxuO0SnDEY0sKzPXuDRby4Z6zD6%2BicoRlWhYSG5yDyC87nKxps16%2F0CcNkFjxudPJnkHBXjGgxOtaKK1nLmHx2QSbTk%2BERkOTajeDUqipRarNGLmCm5b5ubOQWxj7epkJ%2BrcFHNbIbN2gtFUCDf11MNk%2FGzfJyzpkzdn%2BvWuccQxMBv7l045Jp0ONYnXSEyO61IF%2Fy8S3at3tchvwq4m8wG8K1Iunf%2BJrq6nMKHCKHgH%2FB9V%2Bn0GVS1CLbsa0%2BI5Hs9Mh%2Futirv4RVYc22xOgm33PQVLw3zVXvZEgtop255uhhq2g5lVblUd3cPxJv2HQxTN10oHJF%2BzdBAWU6uGlyJESRfI0U9HblANH5EbxJHaMZczOp5OMPGeklHDYIbJ%2FhXjkKYrK6YUR%2FC3lSrxFm2xzXKjLF2X%2BHTh1QhfuZ9Eg%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAQ3EGR57JQ5MJJMMQ%2F20241118%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241118T234700Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=14c40bda1d0f2b348f7661a7954ac50c8c1945f56ca46e375cc71c4c74c87107",
        },
      },
    },
    compositionMetaData: {
      width: 720,
      height: 1080,
      fps: 30,
      duration: 1500,
      compositionId: "new-dynamic-composition",
    },
    transitions: {},
  },
};
