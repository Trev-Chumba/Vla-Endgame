import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import Georgia from '../../fonts/Georgia.ttf';
import georgiab from '../../fonts/georgiab.ttf';

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
export const LSAHeader = (props) => {
  const caseDetails = props.data || {};

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;

  // const caseData = props.data.caseDetails || []

  const date = Date();

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
      <Text style={{ ...styles.Text, margin: 'auto' }}> LIFESTYLE AUDIT REPORT </Text>

      <View style={styles.Line} />
      <Text style={styles.Text}>TO :{caseDetails.cSource}</Text>
      {caseDetails.through == '' ? null : (
        <Text style={styles.Text}>THRO': {caseDetails.through}</Text>
      )}
      <Text style={styles.Text}>FROM : {caseDetails.subject} </Text>
      <Text style={styles.Text}>DATE : {today} </Text>
      <Text style={styles.Text}>REF : {caseDetails.reference} </Text>

      <View style={styles.Line} />

      <Text style={styles.Text}>
        INVESTIGATION REPORT ON ALLEGATIONS OF BEING IN POSSESSION OF UNEXPLAINED WEALTH BY{' '}
      </Text>
      <Text>{'\n'}</Text>
      <Text style={styles.Text}>HOD REGISTER NO -INQUIRY NO . : {caseDetails.caseNo} </Text>

      <View style={styles.Line} />
    </View>
  );
};
