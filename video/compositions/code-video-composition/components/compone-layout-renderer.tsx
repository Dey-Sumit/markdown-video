import React from "react";

type GridCell = {
  content?: React.ReactNode;
  className?: string;
};

type OxGridData = {
  gridRows: number;
  gridColumns: number;
  gap?: number;
  minHeight?: string;
  cellClassName?: string;
  cells?: GridCell[];
};

const OxGrid = ({ data }: { data: OxGridData }) => {
  const {
    gridRows,
    gridColumns,
    gap = 4,
    minHeight = "100px",
    cellClassName = "",
    cells = [],
  } = data;

  const totalCells = gridRows * gridColumns;
  const defaultCells = Array.from({ length: totalCells }).map(() => ({
    content: null,
    className: "",
  }));
  const mergedCells = [...cells, ...defaultCells].slice(0, totalCells);

  return (
    <section
      className="grid h-full w-full rounded-lg p-8"
      style={{
        gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
        gridTemplateRows: `repeat(${gridRows}, 1fr)`,
        gap: `${gap}px`,
        minHeight,
      }}
    >
      {mergedCells.map((cell, index) => (
        <div
          key={index}
          className={`rounded border ${cellClassName} ${cell.className || ""}`}
        >
          {cell.content}
        </div>
      ))}
    </section>
  );
};

type OxFlexData = {
  flexDirection: "row" | "column";
  justifyContent: "center" | "start" | "end";
  alignItems: "center" | "start" | "end";
  flexItemsCount: number;
  gap?: number;
};
const OxFlex = ({ data }: { data: OxFlexData }) => {
  return (
    <section
      className="flex h-full w-full border p-8"
      style={{
        flexDirection: data.flexDirection,
        justifyContent: data.justifyContent,
        alignItems: data.alignItems,
        gap: `${data.gap}px`,
      }}
    >
      {Array.from({ length: data.flexItemsCount }).map((_, index) => (
        <div key={index} className="h-full w-full border">
          {index}
        </div>
      ))}
    </section>
  );
};

type ComponentToDataMap = {
  OxGrid: OxGridData;
  OxFlex: OxFlexData;
};

export interface contentLayoutReturnType {
  name: "OxGrid" | "OxFlex";
  data: ComponentToDataMap[keyof ComponentToDataMap];
}

const cells: BentoCell[] = [
  { content: "Featured", rowSpan: 2, colSpan: 2 },
  { content: "News", colSpan: 2 },
  { content: "Updates", rowSpan: 2 },
  { content: "Stats" },
  { content: "Info", colSpan: 2 },
  { content: "Contact" },
];
type BentoCell = {
  content?: React.ReactNode;
  className?: string;
  rowSpan?: number;
  colSpan?: number;
};

type OxBentoData = {
  gridRows: number;
  gridColumns: number;
  gap?: number;
  minHeight?: string;
  cellClassName?: string;
};

const OxBento = ({ data }: { data: OxBentoData }) => {
  const {
    gridRows,
    gridColumns,
    gap = 16,
    minHeight = "500px",
    cellClassName = "",
  } = data;

  return (
    <div
      className="grid h-full rounded-lg p-4"
      style={{
        gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`,
        gap: `${gap}px`,
        minHeight,
      }}
    >
      {cells.map((cell, index) => (
        <div
          key={index}
          className={`rounded-lg border border-gray-700 bg-gray-900 p-4 text-primary shadow-2xl ${cellClassName} ${cell.className || ""}`}
          style={{
            gridRow: `span ${cell.rowSpan || 1}`,
            gridColumn: `span ${cell.colSpan || 1}`,
            minHeight: 0,
            minWidth: 0,
          }}
        >
          {cell.content || `Cell ${index + 1}`}
        </div>
      ))}
    </div>
  );
};

const components = {
  OXGRID: OxGrid,
  OXFLEX: OxFlex,
  OXBENTO: OxBento,
};

export const ComponentLayoutRenderer = ({
  name,
  data,
}: {
  name: "OxGrid" | "OxFlex" | "OxBento";
  data: ComponentToDataMap[keyof ComponentToDataMap];
}) => {
  const compName = name.toUpperCase();

  const Component = components[compName];

  if (!Component) {
    return (
      <div className="h-full w-full bg-red-700 p-10 text-white">
        Component not found
      </div>
    );
  }

  //   return <div className="h-full w-full bg-indigo-600">HELLO WORLDS</div>;
  return <Component data={data as any} />;
};

export default ComponentLayoutRenderer;
