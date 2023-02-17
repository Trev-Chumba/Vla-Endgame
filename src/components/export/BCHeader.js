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

// //   /home/Muntaz/Documents/work/icase/src/fonts/georgia/NotoSansGeorgian-VariableFont.ttf

export const BcHeader = (props) => {
  const caseDetails = props.data || {};
  console.log('CASE DETAILS HEADER', caseDetails);

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
      <Text style={{ ...styles.Text, margin: 'auto' }}>
        {' '}
        INTELLIGENCE &amp; STRATEGIC OPERATIONS DEPARTMENT
      </Text>
      <Text style={{ ...styles.Text, margin: 'auto' }}> BACKGROUND REPORT</Text>

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
      <Text style={styles.Text}>REF : {caseDetails.reference} </Text>
      {/* <Text>{'\n'}</Text> */}
      <Text style={styles.Text}>DATE : {today} </Text>

      <View style={styles.Line} />

      <Text style={styles.Text}>RE : BACKGROUND REPORT FOR CANDIDATES</Text>
      <Text>{'\n'}</Text>
      <Text style={styles.Text}>INQUIRY NO : {caseDetails.caseNo} </Text>

      <View style={styles.Line} />
    </View>
  );
};
