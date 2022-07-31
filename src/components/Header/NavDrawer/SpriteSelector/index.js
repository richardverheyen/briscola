import { useContext } from "react";
import { Game } from "contexts";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function SpriteSelector() {
  const { sprite, updateSprite } = useContext(Game);

  return (
    <FormControl variant="standard">
      <InputLabel id="demo-simple-select-label">Card Graphics</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={sprite}
        label="Age"
        onChange={(e) => {
          updateSprite(e.target.value);
        }}
      >
        <MenuItem value={"napoletane"}>Napoletane by Dal Negro</MenuItem>
        <MenuItem value={"carte-piacentine"}>
          Carte Piacentine by Modiano
        </MenuItem>
      </Select>
    </FormControl>
  );
}
