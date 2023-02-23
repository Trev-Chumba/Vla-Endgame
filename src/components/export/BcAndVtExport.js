import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { BcHeader } from './BCHeader';
import Georgia from '../../fonts/Georgia.ttf';
import georgiab from '../../fonts/georgiab.ttf';
import gillItalic from '../../fonts/GillSansz.otf'
import { red } from '@mui/material/colors';
import { unset, wrap } from 'lodash';
import { Hidden } from '@mui/material';

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

  family:'Gill_Bold_Italic',
  fonts: [
    {
      src: gillItalic
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

export default function BcAndVtExPort(props) {
  const bioData = props.data.bio || {};
  const caseDetails = props.data.caseDetails || {};

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
      //fontWeight: 'demibold',
      fontFamily: 'Georgia_bold'
    },

    textTableHeader: {
      fontSize: 12,
      //fontWeight: 'demibold'
      fontFamily: 'Georgia_bold'
    },

    textBody: {
      //fontWeight: 'normal',
      fontFamily: 'Georgia',
      fontSize: 12,
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
      display:'flex',
      justifyContent: 'space-between',
      width: '100%',
      margin: 0
    },

    td: {
      flexDirection: 'row',
       borderColor: 'gray',
      borderWidth: 1,
      padding: 5,
      flex: 1
      
    }
  });

  return (
    <Page size="A4" style={styles.page}>
      <Image src={'/vla/static/l_head.png'} style={styles.sideHead} fixed />

      <View style={styles.body}>
        <Image
          style={{ marginHorizontal: 'auto', height: 70 }}
          src={'/vla/static/kra_logo_name.jpg'}
          fixed
        />
        <BcHeader data={caseDetails} />
        console.log("Export",caseDetails)
        <Text style={styles.textSubHeader}>1.0 Reason for Background Check</Text>
        <Text style={styles.textBody}>{caseDetails.cReasons}</Text>
        <View style={styles.table}>
          <View style={styles.tr}>
            {/* <Text style={{ ...styles.td, ...styles.textTableHeader }}>No</Text> */}
            <Text style={{ ...styles.td, ...styles.textTableHeader }}>S/NO</Text>
            {/* <Text style={{ ...styles.td, ...styles.textTableHeader }}>P/No.</Text> */}
            <Text style={{ ...styles.td, ...styles.textTableHeader }}>ID NO</Text>
            <Text style={{ ...styles.td, ...styles.textTableHeader }}>NAME OF APPLICANT</Text>
            <Text style={{ ...styles.td, ...styles.textTableHeader }}>STATUS</Text>
            <Text style={{ ...styles.td, ...styles.textTableHeader }}>POSITION APPLIED</Text>
          </View>

          <View style={styles.tr}>
            <Text style={{ ...styles.td, ...styles.textBody }}>1</Text>
            <Text style={{ ...styles.td, ...styles.textBody }}>{bioData.idNo}</Text>
            <Text style={{ ...styles.td, ...styles.textBody }}>{bioData.subject_Name}</Text>
            <Text style={{ ...styles.td, ...styles.textBody }}>{caseDetails.candidateType}</Text>
            <Text style={{ ...styles.td, ...styles.textBody }}>{caseDetails.position}</Text>
          </View>
        </View>
        <Text style={styles.textSubHeader}>2.0 Objective of the Background Check</Text>
        <Text style={styles.textBody}>{caseDetails.objectives}</Text>
        <Text style={styles.textSubHeader}>3.0 Findings</Text>
        <View style={styles.table}>
          <View style={styles.tr}>
            <Text style={{ ...styles.td, ...styles.textTableHeader }}>S/NO</Text>
            <Text style={{ ...styles.td, ...styles.textTableHeader }}>ID NO.</Text>
            <Text style={{ ...styles.td, ...styles.textTableHeader }}>INQUIRY NO.</Text>
            <Text style={{ ...styles.td, ...styles.textTableHeader }}>NAME OF APPLICANT</Text>
            <Text style={{ ...styles.td, ...styles.textTableHeader }}>REMARKS</Text>
          </View>

          <View style={styles.tr}>
            <Text style={{ ...styles.td, ...styles.textBody }}>1</Text>
            <Text style={{ ...styles.td, ...styles.textBody }}>{bioData.idNo}</Text>
          <Text style={{ ...styles.td, ...styles.textBody }}>{caseDetails.caseNo} </Text>
            <Text style={{ ...styles.td, ...styles.textBody }}>{bioData.subject_Name}</Text>
            <Text style={{ ...styles.td, ...styles.textBody }}>{caseDetails.remarks}</Text>
          </View>
        </View>
        <Text style={styles.textSubHeader}>4.0 Recommendation</Text>
        <Text style={styles.textBody}>{caseDetails.recomentation}</Text>
        {/* <Image style={{ width: 100 }} src={'/vla/static/footer.png'} /> */}
        {/* <Image
          style={{
            marginHorizontal: 'auto',
            marginTop: 'auto',
            width: 230,
            height: 20
          }}
       
        /> */}
        <Text
            style={{
                marginTop: 'auto',
                marginHorizontal: 'auto',
                fontStyle: 'Gill_Bold_Italic',
                fontSize: 12,
                color: 'red'
            }}
            fixed
            >
            TULIPE USHURU,TUJITEGEMEE!
            </Text>
      </View>
    </Page>
  );
}
