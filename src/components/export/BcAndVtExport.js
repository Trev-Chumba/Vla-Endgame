import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { useState, useEffect } from 'react';
import Georgia from '../../fonts/Georgia.ttf';
import georgiab from '../../fonts/georgiab.ttf';
import gillItalic from '../../fonts/GillSansz.otf';
import { red } from '@mui/material/colors';
import { unset, wrap } from 'lodash';
import { Hidden } from '@mui/material';
import { BatchHeader } from './BatchHeader';
import { BcHeader } from './BCHeader';

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
  const [cFinding, setCfind] = React.useState()
  const bioData = props.data.bio || {};
  const caseDetails = props.data.caseDetails || {};
  const caseType = caseDetails.inquiryType;
  console.log("::Case Details All", caseDetails, caseType)
  const [caseTxt, setcaseTxt] = useState('');
  
  let find = JSON.parse(caseDetails.cFindings)
  let find2
 if(find) 
 {let find2 = find.map(element => ({
    element
  }));}
  else
  {

  }
  console.log(find2)
  useEffect(() => {
    if (caseType == 'Vetting') {
      setcaseTxt('Vetting');
    } else {
      setcaseTxt('Background');
    }
  }, []);

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
      fontSize: 12
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
      display: 'flex',
      //justifyContent: 'space-between',
      width: '100%',
      margin: 0
    },

    td: {
      flexDirection: 'row',
      borderColor: 'gray',
      borderWidth: 1,
      padding: 5,
      //width: '10%'
      flex: 1
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
    textbody2: {
      fontFamily: 'Georgia',
      fontSize: 12,
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
        <BcHeader data={caseDetails} />
        console.log("Export",caseDetails)
        <Text style={styles.textSubHeader}>1.0 Reason for {caseTxt} Check</Text>
        <Text style={styles.textBody}>{caseDetails.cReasons}</Text>
        <View style={styles.table}>
          <View style={styles.tr}>
            {/* <Text style={{ ...styles.td, ...styles.textTableHeader }}>No</Text> */}
            <Text style={{ ...styles.td1, ...styles.textTableHeader }}>S/NO</Text>
            {/* <Text style={{ ...styles.td, ...styles.textTableHeader }}>P/No.</Text> */}
            <Text style={{ ...styles.td2, ...styles.textTableHeader }}>ID NO</Text>
            <Text style={{ ...styles.td, ...styles.textTableHeader }}>NAME OF APPLICANT</Text>
            <Text style={{ ...styles.td, ...styles.textTableHeader }}>STATUS</Text>
            <Text style={{ ...styles.td, ...styles.textTableHeader }}>POSITION APPLIED</Text>
          </View>

          <View style={styles.tr}>
            <Text style={{ ...styles.td1, ...styles.textBody }}>1</Text>
            <Text style={{ ...styles.td2, ...styles.textBody }}>{bioData.idNo}</Text>
            <Text style={{ ...styles.td, ...styles.textBody }}>{bioData.subject_Name}</Text>
            <Text style={{ ...styles.td, ...styles.textBody }}>{caseDetails.candidateType}</Text>
            <Text style={{ ...styles.td, ...styles.textBody }}>{caseDetails.position}</Text>
          </View>
        </View>
        <Text style={styles.textSubHeader}>2.0 Objective of the {caseTxt} Check</Text>
        <Text style={styles.textBody}>{caseDetails.objectives}</Text>
        {caseTxt == 'Vetting' ? (
          <Text style={styles.textBody}>
            2.1 Review information in the KRA integrity records to establish whether there are
            adverse reports, ongoing or concluded investigations with respect to compliance with the
            KRA Code of conduct.
            <Text>{'\n'}</Text>
            <Text style={styles.textBody}>
              2.2 Review KRA tax records to establish whether the officer and associates complied
              with relevant Tax laws.
            </Text>
            <Text style={styles.textBody}>
              2.3 Review & report any other information that may be relevant in assessing conduct of
              the officer.
            </Text>
          </Text>
        ) : (
          <Text style={styles.textBody}>
            2.1 Review integrity of the candidate by evaluating information provided through filled
            background check consent form and through other sources.
            <Text>{'\n'}</Text>
            <Text style={styles.textBody}>
              2.2 Review KRA tax records to establish whether the candidate and associates have
              complied with relevant Tax laws.
            </Text>
            <Text>{'\n'}</Text>
            <Text style={styles.textBody}>
              2.3 Review & report any other information provided by other agencies that may be
              relevant in assessing the conduct of the candidate
            </Text>
          </Text>
        )}
        <Text style={styles.textBody}></Text>
        <Text style={styles.textSubHeader}>3.0 Findings</Text>
        <View style={styles.table}>
          <View style={styles.tr}>
            <Text style={{ ...styles.td1, ...styles.textTableHeader }}>S/NO</Text>
            <Text style={{ ...styles.td2, ...styles.textTableHeader }}>ID NO.</Text>
            <Text style={{ ...styles.td, ...styles.textTableHeader }}>INQUIRY NO.</Text>
            <Text style={{ ...styles.td, ...styles.textTableHeader }}>NAME OF APPLICANT</Text>
            <Text style={{ ...styles.td, ...styles.textTableHeader }}>REMARKS</Text>
          </View>

          <View style={styles.tr}>
            <Text style={{ ...styles.td1, ...styles.textBody }}>1</Text>
            <Text style={{ ...styles.td2, ...styles.textBody }}>{bioData.idNo}</Text>
            <Text style={{ ...styles.td, ...styles.textBody }}>{caseDetails.caseNo} </Text>
            <Text style={{ ...styles.td, ...styles.textBody }}>{bioData.subject_Name}</Text>
            <Text style={{ ...styles.td, ...styles.textBody }}>{caseDetails.remarks}</Text>
          </View>
        </View>
        <Text style={styles.textSubHeader}>4.0 Recommendation</Text>
        {find  && <Text>{find.map(find => <Text style={{...styles.td, ...styles.textBody}}>{ find} {"\n"}</Text>)}</Text>}
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
