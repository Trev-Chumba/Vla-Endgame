import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
//import '@fontsource/noto-sans-georgian';
import Georgia from '../../fonts/Georgia.ttf';
import georgiab from '../../fonts/georgiab.ttf';
import { fontFamily } from '@mui/system';
import { blue } from '@mui/material/colors';

Font.register({
  family: 'Georgia',
  fonts: [
    {
      src: Georgia,
      fontWeight: 'bold'
    }
  ]
});

Font.register({
  family: 'Georgia_bold',
  fonts: [
    {
      src: georgiab
    }
  ]
});
export const chunkSubstr = (str, size) => {
  const numChunks = Math.ceil(str.length / size);
  const chunks = new Array(numChunks);

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size);
  }

  return chunks;
};

Font.registerHyphenationCallback((word) => {
  if (word.length > 12) {
    return chunkSubstr(word, 10);
  } else {
    return [word];
  }
});

// //   /home/Muntaz/Documents/work/icase/src/fonts/georgia/NotoSansGeorgian-VariableFont.ttf

export const PiHeader = (props) => {
  const caseDetails = props.data || {};
  const bioData = props.subjectdata || {};
  console.log('CASE DETAILS PI', caseDetails);
  console.log('CASE DETAILS BIo', bioData);

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;

  const styles = StyleSheet.create({
    Logo: {
      margin: 'auto',
      height: 30,
      width: 70
    },

    Line: {
      height: 2,
      backgroundColor: 'black',
      width: '100%',
      marginVertical: 5
    },
    Text: {
      fontSize: 12,
      marginVertical: 2,
      fontFamily: 'Georgia_bold'
    }
  });

  return (
    <View>
      <Text style={{ ...styles.Text }}>
        {' '}
        INTELLIGENCE, STRATEGIC OPERATIONS, INVESTIGATIONS &amp; ENFORCEMENT
      </Text>

      <Text style={{ ...styles.Text, margin: 'auto' }}> PRELIMINARY INVESTIGATION REPORT </Text>

      <View style={styles.Line} />

      <Text style={styles.Text}>TO :{caseDetails.cSource}</Text>
      {/* <Text>{'\n'}</Text> */}
      {/* <Text style={styles.Text}>THRO' :{caseDetails.through}</Text> */}
      {caseDetails.through == '' ? null : (
        <Text style={styles.Text}>THRO': {caseDetails.through}</Text>
      )}
      {/* <Text>{'\n'}</Text> */}
      <Text style={styles.Text}>FROM : {caseDetails.subject} </Text>
      {/* <Text>{'\n'}</Text> */}
      <Text style={styles.Text}>DATE : {today} </Text>
      <Text style={styles.Text}>REF : {caseDetails.reference} </Text>
      {/* <Text>{'\n'}</Text> */}

      <View style={styles.Line} />

      <Text style={styles.Text}>
        PRELIMINARY INVESTIGATION REPORT ON ALLEGATIONS OF BEING IN POSSESSION OF UNEXPLAINED WEALTH
        BY {bioData.subject_Name}
      </Text>
      <Text>{'\n'}</Text>
      <Text style={styles.Text}>INQUIRY NO : {caseDetails.caseNo} </Text>

      <View style={styles.Line} />
    </View>
  );
};
