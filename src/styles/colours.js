const colours = new CSSStyleSheet();
colours.replaceSync(`
:root {
  /* Palette from <https://atlassian.design/foundations/color> */

  /* Neutrals */
  --col-N900: #091E42;
  --col-N800: #172B4D;
  --col-N500: #42526E;
  --col-N200: #6B778C;

  --col-N60: #B3BAC5;
  --col-N50: #C1C7D0;
  --col-N40: #DFE1E6;
  --col-N30: #EBECF0;
  --col-N20: #F4F5F7;
  --col-N10: #FAFBFC;
  --col-N0: #FFFFFF;
  
  /* Reds */
  --col-R300: #FF5630;
  --col-R50: #FFEBE6;

  /* Blues */
  --col-B500: #0747A6;
  --col-B400: #0052CC;
  --col-B300: #0065FF;
  --col-B200: #2684FF;
  --col-B100: #4C9AFF;
  --col-B50: #DEEBFF;

  /* Teals */
  --col-T300: #00B8D9;

  /* Purples */
  --col-P400: #5243AA;
  --col-P300: #6554C0;
}
`);

export default colours;
