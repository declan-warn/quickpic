const colours = new CSSStyleSheet();
colours.replaceSync(`
  * {
    /* Palette from <https://atlassian.design/foundations/color> */

    /* Neutrals */
    --col-N40: #DFE1E6;
    --col-N30: #EBECF0;
    --col-N10: #FAFBFC;
    --col-N0: #FFFFFF;

    /* Blues */
    --col-B100: #4C9AFF;
  }
`);

export default colours;
