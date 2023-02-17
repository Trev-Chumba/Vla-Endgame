import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import Georgia from '../../fonts/Georgia.ttf';
import georgiab from '../../fonts/georgiab.ttf';

export const LSAHeader = (props) => {
  const caseDetails = props.data || {};

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;

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
      <Text style={{ ...styles.Text, margin: 'auto' }}>
        {' '}
        INTELLIGENCE &amp; STRATEGIC OPERATIONS DEPARTMENT
      </Text>
      <Text style={{ ...styles.Text, margin: 'auto' }}> LIFESTYLE AUDIT PROFILING REPORT </Text>

      <View style={styles.Line} />
      <Text style={styles.Text}>TO :{caseDetails.cSource}</Text>
      {caseDetails.through == '' ? null : (
        <Text style={styles.Text}>THRO': {caseDetails.through}</Text>
      )}
      <Text style={styles.Text}>FROM : {caseDetails.subject} </Text>
      <Text style={styles.Text}>REF : {caseDetails.reference} </Text>
      <Text style={styles.Text}>DATE : {today} </Text>

      <View style={styles.Line} />

      <Text style={styles.Text}>
        INVESTIGATION REPORT ON ALLEGATIONS OF BEING IN POSSESSION OF UNEXPLAINED WEALTH BY{' '}
      </Text>
      <Text>{"\n"}</Text>
      <Text style={styles.Text}>HOD REGISTER NO -INQUIRY NO . : {caseDetails.caseNo} </Text>

      <View style={styles.Line} />
    </View>
  );
};
