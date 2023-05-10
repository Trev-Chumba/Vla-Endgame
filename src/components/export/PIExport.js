import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { BcHeader } from './BCHeader';
import Georgia from '../../fonts/Georgia.ttf';
import georgiab from '../../fonts/georgiab.ttf';
import { PiHeader } from './PIHeader';
import gillItalic from '../../fonts/GillSansz.otf';

import ReactHtmlParser from 'react-html-parser'
import Html from 'react-pdf-html';
import "suneditor/dist/css/suneditor.min.css";
import "../../../../vla-test/node_modules/suneditor/dist/css/suneditor.min.css";
import '../../../src/index.css'
import HtmlParser from 'react-html-parser';
import { parseJSON } from 'date-fns';

Font.register({
  family: 'Georgia',
  fonts: [
    {
      src: Georgia,
      fontWeight: 'bold'
    }
  ]
});


export default function PIExport(props) {
  const bioData = props.data.bio || {};
  const caseDetails = props.data.caseDetails;
  const [cFinding, setCfinding] = React.useState([])
  console.log('CaseDets::', caseDetails);
  console.log('CaseDets2::', bioData);
  //console.log('CaseDets2::', caseDetails.cFindings);
  // setCfinding(caseDetails.cFindings.map(element => ({
  //   rec: element,
  // })));
  try {
    arr = JSON.parse(caseDetails.cFindings);
    console.log(' JSON array parsed successfully');
  } catch (err) {
    console.log(' invalid JSON provided', err);
    // report error
  }

  console.log(cFinding, "Help here")
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
      fontSize: 12,
      marginVertical: 10,
      fontFamily: 'Georgia_bold'
    },

    textTableHeader: {
      fontSize: 12,
      fontFamily: 'Georgia_bold'
    },

    textBody: {
      fontWeight: 'normal',
      fontFamily: 'Georgia',
      fontSize: 12
    },
    textBody2: {
      fontWeight: 'normal',
      fontFamily: 'Georgia',
      fontSize: 12,
      border: 1,
      display:'flex',
      flexDirection: 'column',
      width: '100%'
    },

    table: {
      maxWidth: '100%',
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
      flex: 1
    },
    td451: {
      borderColor: 'gray',
      borderWidth: 1,
      padding: 5,
      flex: 1,
      flexDirection: 'column',
    },

    td1: {
      flexDirection: 'row',
      borderColor: 'gray',
      borderWidth: 1,
      padding: 5,
      width: '10%'
    },

    td2: {
      flexDirection: 'row',
      borderColor: 'gray',
      borderWidth: 1,
      padding: 5,
      //width: '10%'
      width: '15%'
    },

    td2a: {
      flexDirection: 'row',
      borderColor: 'gray',
      borderWidth: 1,
      padding: 5,
      //width: '10%'
      width: '35%'
    }
  });


  return (
    <Page size="A4" style={styles.page}>
      <Image src={'/vla/static/l_head.png'} style={styles.sideHead} fixed />


            <View style={styles.body}>


                <Image style={{ marginHorizontal: 'auto', height: 70 }} src={'/vla/static/kra_logo_name.jpg'} fixed />


                <BcHeader />

                <Text style={styles.textSubHeader}>1.0 Reason for Background Check</Text>

                <Text style={styles.textBody}>
                    {caseDetails.cReasons}
                </Text>

                <View style={styles.table} >
                    <View style={styles.tr}>
                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            No
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            P/No.
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Name
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Status
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Position Applied
                        </Text>
                    </View>

                    <View style={styles.tr}>
                        <Text style={{ ...styles.td, ...styles.textBody }}>
                            1
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textBody }}>
                            {bioData.idNo}
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textBody }}>
                            {bioData.subject_Name}
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textBody }}>
                            {caseDetails.candidateStatus}
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textBody }}>
                            {caseDetails.positionApplied}
                        </Text>
                    </View>
                </View>

                <Text style={styles.textSubHeader}>2.0 Objective of the Vetting</Text>

                <Text style={styles.textBody}>
                    {caseDetails.objectives}
                </Text>

                <Text style={styles.textSubHeader}>3.0 Findings</Text>

                <View style={styles.table}>
                    <View style={styles.tr}>
                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            No
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            P/No.
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Inquiry No.
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Name
                        </Text>

                        <Text style={{ ...styles.td, ...styles.textTableHeader }}>
                            Remarks
                        </Text>
                    </View>

                    <View style={styles.tr}>
                        <Text style={{ ...styles.td, ...styles.textBody }}>
                            1
                        </Text>

        <Text style={styles.textSubHeader}>2.0 Preliminary Findings</Text>
        <Text style={styles.textBody}><Html stylesheet={styles}>{caseDetails.findings}</Html></Text>

        <Text style={styles.textSubHeader}>3.0 Way Forward</Text>
        <Text style={styles.textBody}>{caseDetails.remarks}</Text>           
        <Text style={styles.textSubHeader}>4.0 Recommendation</Text>
        <Text style={styles.textBody}>{cFinding}</Text> 
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