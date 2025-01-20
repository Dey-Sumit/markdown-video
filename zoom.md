/*  zoom: {
    defaults: { level: "1", delay: "0", point: "(0,0)" },
    validKeys: ["level", "delay", "point"],
    processors: {
      level: Number,
      delay: Number,
      point: (value) => {
        const [x, y] = value.slice(1, -1).split(",").map(Number);
        return { x, y };
      },
    },
  }, */