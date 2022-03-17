import * as React from 'react';
import {styled} from '@mui/system';
import SliderUnstyled from '@mui/base/SliderUnstyled';

const Slider = styled(SliderUnstyled)(
    () => `
  color: #1976d2;
  height: 4px;
  width: 100%;
  display: inline-block;
  position: relative;
  cursor: pointer;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
  position: absolute;
  padding-bottom: 20px;

  & .MuiSlider-rail {
    display: block;
    position: absolute;
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background-color: currentColor;
    opacity: 0.38;
  }

  & .MuiSlider-track {
    display: block;
    position: absolute;
    height: 4px;
    border-radius: 2px;
    background-color: currentColor;
  }

  & .MuiSlider-thumb {
    position: absolute;
    width: 14px;
    height: 14px;
    margin-left: -6px;
    margin-top: -5px;
    box-sizing: border-box;
    border-radius: 50%;
    outline: 0;
    border: 2px solid currentColor;
    background-color: #fff;
    opacity:0;
  }
  :hover{
    .MuiSlider-thumb {
      opacity:1;
    }
  }
`,
);

export default Slider;