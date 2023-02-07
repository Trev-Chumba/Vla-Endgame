import React from "react";
import { Page, Text, View, Document, StyleSheet, Image,Font} from '@react-pdf/renderer';
// import "@fontsource/noto-sans-georgian";

// Font.register({
//     family: 'Noto Sans Georgian',
//     src: 'https://fonts.gstatic.com/s/notosansgeorgian/v36/PlIaFke5O6RzLfvNNVSitxkr76PRHBC4Ytyq-Gof7PUs4S7zWn-8YDB09HFNdpvnzGjmdZS60A.woff',
   
//   });
  
// //   /home/Muntaz/Documents/work/icase/src/fonts/georgia/NotoSansGeorgian-VariableFont.ttf






export const BcHeader = (props) => {
    const caseDetails = props.data||{}
    console.log("CASE DETAILS HEADER",caseDetails)

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
          
        }
    })

    return (
        <View>

            <Text style={{...styles.Text, margin: 'auto' }}> INTELLIGENCE &amp; STRATEGIC OPERATIONS DEPARTMENT</Text>
            <Text style={{...styles.Text, margin: 'auto' }}> BACKGROUND REPORT </Text>

            <View style={styles.Line} />

            <Text style={styles.Text}>TO :{caseDetails.cSource}</Text>

            {/* <Text style={styles.Text}>THRO' :{caseDetails.through}</Text> */}
            {caseDetails.through == ''? null : <Text style={styles.Text}>THRO':  {caseDetails.through}</Text> }
           

            <Text style={styles.Text}>FROM : {caseDetails.subject}  </Text>
            <Text style={styles.Text}>REF :  {caseDetails.reference}    </Text>
            <Text style={styles.Text}>DATE : {today}   </Text>

            <View style={styles.Line} />

            <Text style={styles.Text}>RE :        BACKGROUND REPORT FOR CANDIDATES</Text>
            <Text style={styles.Text}>INQUIRY NO : {caseDetails.caseNo} </Text>

            <View style={styles.Line} />

        </View>
    )

}