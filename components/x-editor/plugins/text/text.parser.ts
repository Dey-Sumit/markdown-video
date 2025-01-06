import BaseParser from "../../core/base/parser";
import textConfig, { defaultTextArgValues } from "./config";

const textParser = new BaseParser(textConfig, defaultTextArgValues);

export default textParser;
