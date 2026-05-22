import { Grid, Paper } from "@mui/material";
import React, { useState } from "react";
import MonacoEditor from "react-monaco-editor";
import { AutoSizer } from "react-virtualized";
import TopToolbar from "./TopToolbar";
import BottomToolbar from "./BottomToolbar";

const CodeSection = () => {
  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  return (
    <>
      <TopToolbar />
      <Grid container spacing={2} sx={{ height: "200px" }}>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ padding: "2em 0", width: "100%", height: "100%" }}>
            <AutoSizer>
              {({ width, height }) => {
                return (
                  <MonacoEditor
                    width={width}
                    height={height}
                    language="javascript"
                    theme="vs-dark"
                    value={code1}
                    options={{
                      selectOnLineNumbers: true,
                      minimap: { enabled: false },
                    }}
                    onChange={(value) => {
                      setCode1(value);
                    }}
                  />
                );
              }}
            </AutoSizer>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ padding: "2em 0", width: "100%", height: "100%" }}>
            <AutoSizer>
              {({ width, height }) => {
                return (
                  <MonacoEditor
                    width={width}
                    height={height}
                    language="javascript"
                    theme="vs-dark"
                    value={code2}
                    options={{
                      selectOnLineNumbers: true,
                      minimap: { enabled: false },
                    }}
                    onChange={(value) => {
                      setCode2(value);
                    }}
                  />
                );
              }}
            </AutoSizer>
          </Paper>
        </Grid>
      </Grid>
      <BottomToolbar />
    </>
  );
};

export default CodeSection;
