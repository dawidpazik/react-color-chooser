# react-color-chooser

```sh
npm install react-color-chooser
```

```ts
import { ColorChooser } from "react-color-chooser";

function App() {
  const [color, setColor] = useState("#a349a4");

  return (
    <ColorChooser
      selectedColor={color}
      onColorSelected={setColor}
      mode={{
        predefinedColors: [
          "#000000",
          "#3f48cc",
          "#a349a4",
          "#ed1c24",
          "#fff200",
          "#22b14c",
          "#f29727",
        ],
        allowCustomColors: true,
      }}
    ></ColorChooser>
  );
}
```

![plot](./samples/sample1.png)

