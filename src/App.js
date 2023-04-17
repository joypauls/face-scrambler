import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  // Link,
  VStack,
  // Code,
  Grid,
  theme,
  Flex,
  Select,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
// import { Logo } from './Logo';

import "@tensorflow/tfjs-backend-webgl";

// Load model
const blazeface = require("@tensorflow-models/blazeface");


function App() {

  // initialize canvas
  var canvas = React.useRef();

  // state
  const testImages = ["20230416-AfterlightImage.jpg", "20230407-IMG_7093.jpg"];

  React.useEffect(() => {
    const context = canvas.current.getContext("2d");
    const image = document.getElementById("original");
    // const image = new Image();
    // image.src =
      // "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Picture_icon_BLACK.svg/1200px-Picture_icon_BLACK.svg.png";
    // image.src = "test.jpg"
    image.src = "20230416-AfterlightImage.jpg";
    image.onload = () => {
      // right now this is the SAME SIZE AS IMG - IMPORTANT!!
      context.drawImage(image, 0, 0, 500, 500);

      findFaces().then((predictions) => {
        console.log("Marking" + predictions.length + " Faces...")
        context.fillStyle="#00FF00";
        context.strokeStyle="#00FF00";
        for (let i = 0; i < predictions.length; i++) {
          let start = predictions[i].topLeft;
          let end = predictions[i].bottomRight;
          let size = [end[0] - start[0], end[1] - start[1]];
          // transparent rectangle
          context.globalAlpha = 0.1;
          context.fillRect(start[0], start[1], size[0], size[1]);

          // opaque border
          context.globalAlpha = 1.0;
          context.lineWidth = 1;
          context.strokeRect(start[0], start[1], size[0], size[1]);

          // let tl = predictions[i].topLeft;
          // let br = predictions[i].bottomRight;
          // let sides = [br[0] - tl[0], br[1] - tl[1]];
          // let tr = [tl[0] + sides[0], tl[1]]
          // let bl = [br[0] - sides[0], br[1]]

          // // let corners = [tl, tr, br, bl];
          // let cornerWidth = Math.round(Math.min(...sides) * 0.25)

          // context.strokeStyle="#04e004";
          // context.lineWidth = 3;
          // context.beginPath();

          // // top left
          // context.moveTo(tl[0], tl[1] + cornerWidth);
          // context.lineTo(tl[0], tl[1]);
          // context.lineTo(tl[0] + cornerWidth, tl[1]);

          // // top right
          // context.moveTo(tr[0] - cornerWidth, tr[1]);
          // context.lineTo(tr[0], tr[1]);
          // context.lineTo(tr[0], tr[1] + cornerWidth);

          // // bottom right
          // context.moveTo(br[0], br[1] - cornerWidth);
          // context.lineTo(br[0], br[1]);
          // context.lineTo(br[0] - cornerWidth, br[1]);

          // // bottom left
          // context.moveTo(bl[0] + cornerWidth, bl[1]);
          // context.lineTo(bl[0], bl[1]);
          // context.lineTo(bl[0], bl[1] - cornerWidth);

          // context.stroke();

        }
      });

    };

  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />

          <Flex alignItems="flex-start" justifyContent="center">
            <VStack spacing={5} alignItems="flex-start">
              {/* <VStack spacing={5} alignItems="flex-start"> */}
              <label>
                <VStack alignItems="flex-start">
                  <Text fontSize="sm">Test Image</Text>
                  <Select defaultValue={testImages[0]}>
                    {testImages.map((s) => (
                      <option value={s}>{s}</option>
                    ))}
                  </Select>
                </VStack>
              </label>
              

              <canvas ref={canvas} width={500} height={500} />
              <div style={{display: "none"}}>
                <img id="original" alt="orignal" src="20230416-AfterlightImage.jpg" width="500" height="500" />
              </div>

            </VStack>
          </Flex>
          {/* <img id="original" src="20230407-IMG_7093.jpg" alt="" hidden></img> */}

          {/* <VStack spacing={8}>
            <Logo h="40vmin" pointerEvents="none" />
            <Text>
              Edit <Code fontSize="xl">src/App.js</Code> and save to reload.
            </Text>
            <Link
              color="teal.500"
              href="https://chakra-ui.com"
              fontSize="2xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn Chakra
            </Link>
          </VStack> */}
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;


async function findFaces() {
  const model = await blazeface.load();  
  const img = document.getElementById("original");
  const predictions = await model.estimateFaces(img, false);
  if (predictions.length > 0) {
    console.log(predictions);
    console.log(predictions.length + " Faces Found")
  } else {
    // document.getElementById("status").innerText = "No Face(s) Found";
    console.log("No Faces Found ¯\\_(ツ)_/¯");
  }
  return predictions
}
