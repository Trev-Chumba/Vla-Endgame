import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { BcHeader } from './BCHeader';
import Georgia from '../../fonts/Georgia.ttf';
import georgiab from '../../fonts/georgiab.ttf';
import { PiHeader } from './PIHeader';
import gillItalic from '../../fonts/GillSansz.otf';

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
Font.register({
  family: 'Gill_Bold_Italic',
  fonts: [
    {
      src: gillItalic
    }
  ]
});

export default function PIExport(props) {
  const bioData = props.data.bio || {};
  const caseDetails = props.data.caseDetails;
  console.log('CaseDets::', caseDetails);
  console.log('CaseDets2::', bioData);
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      padding: 20,
      paddingHorizontal: 30,
      justifyContent: 'space-between'
    },

    sideHead: {
      height: '100%',
      width: '5%'
    },

    body: {
      flexDirection: 'column',
      width: '90%'
    },

    textSubHeader: {
      fontSize: 13,
      marginVertical: 10,
      fontFamily: 'Georgia_bold',
      fontWeight: 'demibold'
    },

    textTableHeader: {
      fontSize: 15,
      fontWeight: 'demibold',
      fontFamily: 'Georgia_bold'
    },

    textBody: {
      fontWeight: 'normal',
      fontSize: 12,
      fontFamily: 'Georgia'
    },

    table: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      marginHorizontal: 10,
      marginVertical: 10
    },

    tr: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      margin: 0
    },

    td: {
      borderColor: 'gray',
      borderWidth: 1,
      padding: 5,
      width: '20%'
    }
  });

  return (
    <Page size="A4" style={styles.page}>
      <Image src={'/vla/static/l_head.png'} style={styles.sideHead} fixed />

      <View style={styles.body}>
        <Text
          style={{
            right: 2,
            position: 'absolute',
            fontSize: 9,
            fontFamily: 'Georgia_bold',
            color: 'red'
          }}
          fixed
        >
          CONFIDENTIAL
        </Text>
        <Image
          style={{ marginHorizontal: 'auto', height: 70 }}
          src={'/vla/static/kra_logo_name.jpg'}
          fixed
        />
        <Text
          style={{
            marginHorizontal: 'auto',
            fontSize: 9,
            fontFamily: 'Georgia_bold',
            marginTop: -2,
            marginBottom: 4
          }}
          fixed
        >
          ISO 9001:2015 CERTIFIED
        </Text>
        <PiHeader data={caseDetails} subjectdata={bioData} />

        <Text style={styles.textSubHeader}>1.0 Introduction</Text>

        {/* <Text style={styles.textBody}>
          The subject name is {bioData.subject_Name}, the subject's date of birth is {bioData.dob}
          {'\n'}
        </Text>

        <Text style={styles.textBody}>
          A brief description of the subject is as follows: {'\n'}
          Height: {bioData.height},{'\n'}
          Complexion: {bioData.complexion}
          {'\n'}
          Gender: {bioData.gender}
          {'\n'}
        </Text>
        <Text style={styles.textBody}>
          The subject's known location is at {bioData.location} at {bioData.county}.{'\n'}
        </Text>
        <Text style={styles.textBody}>The executive summary is: {caseDetails.esummary}</Text> */}

        <Text style={styles.textSubHeader}>1.1 Objective of the Preliminary Lifestyle Audit</Text>
        <Text style={styles.textBody}>
          1.1.1 Collect and evaluate basic information to establish whether the subject’s
          applications funds align to the known lawful sources of income.
          <Text>{'\n'}</Text>
          <Text style={styles.textBody}>
            1.1.2 To establish whether the staff has breached the KRA Code of conduct, Public
            officers’ ethics act, Proceeds of Crime and Anti-Money Laundering Act, Anti-Corruption
            and Economic Crimes Act, and any other applicable laws.
          </Text>
          <Text>{'\n'}</Text>
          <Text style={styles.textBody}>
            1.1.3 Review KRA tax records to establish whether the officer or associates have
            complied with relevant Tax laws.
          </Text>
          <Text>{'\n'}</Text>
          <Text style={styles.textBody}>
            1.1.4 Recommend for closure or for a full lifestyle audit.
          </Text>
        </Text>

        <Text style={styles.textSubHeader}>2.0 Preliminary Findings</Text>
        <Text style={styles.textBody}>{caseDetails.findings}</Text>

        <Text style={styles.textSubHeader}>2.0 Way Forward</Text>
        <Text style={styles.textBody}>{caseDetails.remarks}</Text>
        <Text style={styles.textSubHeader}>3.0 Recommendation</Text>

        <Text style={styles.textBody}>{caseDetails.recomentation}</Text>

        <Text style={styles.textSubHeader}>4.0 Findings</Text>
        <Text style={styles.textBody}>{caseDetails.findings}</Text>
        <Text
          style={{
            marginTop: 'auto',
            marginHorizontal: 'auto',
            fontFamily: 'Gill_Bold_Italic',
            fontSize: 15,
            color: 'red'
          }}
          fixed
        >
          Tulipe Ushuru, Tujitegemee!
        </Text>
      </View>
    </Page>
  );
}
