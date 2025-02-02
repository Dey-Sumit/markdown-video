import type { PropsConfig } from "../../core/types/adapter.type";

export const backgroundPropsConfig: PropsConfig = {
  name: "background",
  type: "string",
  description: "Background color",
  examples: {
    transparent: "Default transparent ",
    white: "White background",
    black: "Black background",
    red: "Red background",
    [`"linear-gradient(40deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)"`]:
      "Linear gradient ",
    [`"radial-gradient(circle, #237A57 25%, #093028 100%)"`]:
      "Radial gradient ",
    [`https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg`]:
      "Colorful abstract background",
  },
  validations: [
    {
      type: "enum",
      message: "Invalid background value",
    },
  ],
};

export const orderPropsConfig: PropsConfig = {
  // stack order of the section in the scene
  name: "order",
  type: "number",
  description: "Order in stack of the item in the scene",
  default: 1,
  validations: [
    {
      type: "range",
      message: "Order must be a positive number",
      validate: (value) => Number(value) > 0,
      severity: "warning",
    },
  ],
  examples: {
    1: "First item in the scene",
    2: "Second item in the scene",
    3: "Third item in the scene",
    4: "Fourth item in the scene",
  },
};
