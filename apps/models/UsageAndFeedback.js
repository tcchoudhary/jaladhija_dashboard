const { Sequelize, DataTypes, Op } = require('sequelize');
const cron = require('node-cron');
const sequelize = require("../config/database");

const UsageAndFeedback = sequelize.define(
  "UsageAndFeedback",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cabin_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Cabins', // Reference to Cabins table
        key: 'id',
      },
    },
    CLIENT: DataTypes.STRING,
    TotalWaterRecycled: DataTypes.STRING,
    TotalUsage: DataTypes.STRING,
    ttl: DataTypes.BIGINT,
    Lon: DataTypes.STRING,
    NH3concentration: DataTypes.STRING,
    COconcentration: DataTypes.STRING,
    SHORT_THING_NAME: DataTypes.STRING,
    ShortThingName: DataTypes.STRING,
    SendToDevic: DataTypes.STRING,
    Fanhealth: DataTypes.STRING,
    Lat: DataTypes.STRING,
    INITIATED: DataTypes.STRING,
    IsDeviceStolen: DataTypes.STRING,
    version_code: DataTypes.INTEGER,
    SendToAws: DataTypes.STRING,
    Floorcleanhealth: DataTypes.STRING,
    Freshwaterlevel: DataTypes.STRING,
    Lighthealth: DataTypes.STRING,
    LuminosityStatus: DataTypes.STRING,
    ThingName: DataTypes.STRING,
    AverageFeedback: DataTypes.STRING,
    Recyclewaterlevel: DataTypes.STRING,
    COMPLEX: DataTypes.STRING,
    THING_NAME: DataTypes.STRING,
    CH4concentration: DataTypes.STRING,
    Flushhealth: DataTypes.STRING,
     created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // यह अब सिर्फ तारीख देगा
    },
  },
  {
    tableName: "UsageAndFeedback",
    timestamps: false,
  }
);

//   UsageAndFeedback.sync({alter:true}).then(()=>{
//     console.log("health model created")
// })
module.exports = UsageAndFeedback;


async function insertDailyUsageAndFeedbackRecords() {
  try {
    const recordsToInsert = [];
    const baseData = {
      "CLIENT": "GSCDCL_PH2",
      "COMPLEX": "1000_BED_HOSPITAL",
      // "THING_NAME" और "SHORT_THING_NAME" को डायनेमिकली बनाएंगे
      // "Lon", "Lat", "ID", "SendToDevic", "IsDeviceStolen", "SendToAws" - इन्हें रैंडम या डिफ़ॉल्ट मान दें
      "Lon": "",
      "Lat": "",
      "SendToDevic": "1", // आपके डेटा में "1" है
      "IsDeviceStolen": "",
      "SendToAws": "0", // आपके डेटा में "0" है
      "INITIATED": "LuminosityStatus", // आपके डेटा में यह स्ट्रिंग है
      "version_code": 7, // आपके डेटा में "7" है
      "AverageFeedback": "0", // आपके डेटा में "0" है
    };

    const totalCabins = 40;
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0]; // created_at के लिए

    for (let cabinId = 1; cabinId <= totalCabins; cabinId++) {
      const shortThingName = `FWC_${String(cabinId).padStart(3, '0')}`;
      const thingName = `MP1404_23072024_003_${shortThingName}`;
      
      // प्रत्येक केबिन के लिए एक ही दैनिक UsageAndFeedback रिकॉर्ड डालें
      // क्योंकि इसमें कुल उपयोग/पानी/स्वास्थ्य डेटा होता है, जो प्रति दिन एक सारांश होता है।
      const currentTimeMillis = Date.now();
      const ttl = Math.floor((currentTimeMillis / 1000) + (365 * 24 * 60 * 60)); // 1 साल आगे का TTL (seconds)

      recordsToInsert.push({
        cabin_id: cabinId,
        CLIENT: baseData.CLIENT,
        TotalWaterRecycled: String(Math.floor(Math.random() * 500)), // रैंडम वैल्यू
        TotalUsage: String(Math.floor(Math.random() * 2000)), // रैंडम वैल्यू
        ttl: ttl,
        Lon: baseData.Lon,
        NH3concentration: String(Math.floor(Math.random() * 200)), // रैंडम वैल्यू
        COconcentration: String(Math.floor(Math.random() * 200)), // रैंडम वैल्यू
        SHORT_THING_NAME: shortThingName,
        ShortThingName: shortThingName, // दोनों को समान रखें, या एक को हटा दें अगर डुप्लिकेट है
        SendToDevic: baseData.SendToDevic,
        Fanhealth: String(Math.floor(Math.random() * 4)), // 0-3 रैंडम वैल्यू
        Lat: baseData.Lat,
        INITIATED: baseData.INITIATED,
        IsDeviceStolen: baseData.IsDeviceStolen,
        version_code: baseData.version_code,
        SendToAws: baseData.SendToAws,
        Floorcleanhealth: String(Math.floor(Math.random() * 4)), // 0-3 रैंडम वैल्यू
        Freshwaterlevel: String(Math.floor(Math.random() * 4)), // 0-3 रैंडम वैल्यू
        Lighthealth: String(Math.floor(Math.random() * 4)), // 0-3 रैंडम वैल्यू
        LuminosityStatus: String(Math.floor(Math.random() * 500)), // रैंडम वैल्यू
        ThingName: thingName,
        AverageFeedback: String(Math.floor(Math.random() * 5)), // 0-5 रैंडम फीडबैक
        Recyclewaterlevel: String(Math.floor(Math.random() * 4)), // 0-3 रैंडम वैल्यू
        COMPLEX: baseData.COMPLEX,
        THING_NAME: thingName,
        CH4concentration: String(Math.floor(Math.random() * 150)), // रैंडम वैल्यू
        created_at: todayFormatted,
        Flushhealth: String(Math.floor(Math.random() * 4)), // 0-3 रैंडम वैल्यू
      });
    }

    if (recordsToInsert.length > 0) {
      console.log(`आज के लिए ${recordsToInsert.length} नए UsageAndFeedback रिकॉर्ड्स डालने के लिए तैयार हैं।`);
      await UsageAndFeedback.bulkCreate(recordsToInsert);
      console.log(`${recordsToInsert.length} नए UsageAndFeedback रिकॉर्ड्स UsageAndFeedback टेबल में सफलतापूर्वक इंसर्ट हो गए हैं।`);
    } else {
      console.log('आज के लिए कोई नया UsageAndFeedback रिकॉर्ड इंसर्ट नहीं किया गया।');
    }

  } catch (error) {
    console.error('UsageAndFeedback डेटा डालने में त्रुटि:', error);
  }
}



async function cleanOldUsageAndFeedbackRecords() {
  try {
    const uniqueDatesCount = await UsageAndFeedback.count({
      distinct: true,
      col: sequelize.fn('DATE', sequelize.col('created_at'))
    });

    console.log(`UsageAndFeedback टेबल में मौजूद यूनिक तारीखों की संख्या: ${uniqueDatesCount}`);

    if (uniqueDatesCount > 90) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 90);
      cutoffDate.setHours(0, 0, 0, 0);

      console.log(`UsageAndFeedback में 90 दिन से ज्यादा का डेटाबेस है (${uniqueDatesCount} दिन)। ${cutoffDate.toISOString().split('T')[0]} से पहले के रिकॉर्ड्स डिलीट किए जा रहे हैं।`);

      const deletedCount = await UsageAndFeedback.destroy({
        where: {
          created_at: {
            [Op.lt]: cutoffDate
          }
        }
      });

      console.log(`${deletedCount} पुराने रिकॉर्ड्स UsageAndFeedback टेबल से डिलीट हो गए हैं।`);
    } else {
      console.log('UsageAndFeedback में 90 दिनों से अधिक का डेटा नहीं है। पुराने रिकॉर्ड्स डिलीट नहीं किए गए।');
    }

  } catch (error) {
    console.error('पुराने UsageAndFeedback रिकॉर्ड्स डिलीट करने में त्रुटि:', error);
  }
}




async function startApplication() {
  try {
    await sequelize.authenticate();
    console.log('शेड्यूलर के लिए Database कनेक्शन तैयार है।');

    // सुनिश्चित करें कि सभी टेबल्स मौजूद हैं
    await UsageAndFeedback.sync({ alter: true }); // NEW: UsageAndFeedback टेबल सिंक करें
    console.log("UsageAndFeedback टेबल सिंक हो गई है।");


    // हर दिन सुबह 8:00 बजे (IST) नए रिकॉर्ड डालें
    cron.schedule('10 9 * * *', async () => {
      console.log(`\n--- ${new Date().toLocaleString()} - दैनिक रिकॉर्ड डालने का कार्य शुरू ---`);
      await insertDailyUsageAndFeedbackRecords(); // NEW: UsageAndFeedback रिकॉर्ड
      console.log(`--- ${new Date().toLocaleString()} - दैनिक रिकॉर्ड डालने का कार्य समाप्त ---`);
    }, {
      scheduled: true,
      timezone: "Asia/Kolkata"
    });

    // हर दिन सुबह 8:10 बजे (IST) पुराने रिकॉर्ड्स डिलीट करें
    cron.schedule('10 9 * * *', async () => {
      console.log(`\n--- ${new Date().toLocaleString()} - पुराने रिकॉर्ड्स डिलीट करने का कार्य शुरू ---`);
      await cleanOldUsageAndFeedbackRecords(); // NEW: UsageAndFeedback पुराने रिकॉर्ड
      console.log(`--- ${new Date().toLocaleString()} - पुराने रिकॉर्ड्स डिलीट करने का कार्य समाप्त ---`);
    }, {
      scheduled: true,
      timezone: "Asia/Kolkata"
    });

    console.log('शेड्यूलिंग सेट हो गई है। ऐप चल रहा है।');

  } catch (error) {
    console.error('एप्लिकेशन शुरू करने में गंभीर त्रुटि:', error);
    process.exit(1);
  }
}

// एप्लिकेशन शुरू करें
// startApplication();






// Helper function to get a random integer within a range
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to get a random float within a range (for concentrations/levels)
const getRandomFloat = (min, max, decimals = 2) => {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
};

// Helper function to get a random element from an array
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateAndInsertUsageAndFeedbackData = async () => {
    const numDays = 90;
  const numCabins = 40; // Total number of cabin IDs (1 to 40)
  const entriesPerCabinPerDay = 5; // Key: 10 records FOR EACH CABIN, FOR EACH DAY

  // Fixed current time for "today's" reference: Sunday, July 20, 2025 at 3:43:20 AM IST.
  const now = new Date('2025-07-20T03:43:20+05:30'); // +05:30 for IST

  const fixedClient = "MP_Clients_A";
  const fixedComplex = "MP_Clients_A";

  const recordsToInsert = [];

  for (let dayOffset = 0; dayOffset < numDays; dayOffset++) {
    // Calculate the specific historical date for this iteration.
    const currentDay = new Date(now);
    currentDay.setDate(now.getDate() - dayOffset);
    currentDay.setHours(0, 0, 0, 0); // Set time to beginning of the day for consistency in historical context

    for (let cabinId = 1; cabinId <= numCabins; cabinId++) { // Loop through EACH of the 40 cabins
      // Use the fixed values for all records
      const client = fixedClient;
      const complex = fixedComplex;

      const shortThingName = `MP_C${cabinId}`;
      const thingName = `CABIN_${cabinId}_MP`; // Using the ThingName as per the model

      for (let entryNum = 0; entryNum < entriesPerCabinPerDay; entryNum++) { // Generate 10 entries for THIS specific cabin on THIS specific day
        // Generate a random time within the current historical day
        const entryHour = getRandomInt(6, 22); // Between 6 AM and 10 PM
        const entryMinute = getRandomInt(0, 59);
        const entrySecond = getRandomInt(0, 59);

        const recordTime = new Date(currentDay); // This will be the base for created_at and ttl
        recordTime.setHours(entryHour, entryMinute, entrySecond, getRandomInt(0, 999)); // Add milliseconds

        // Generate plausible random data for new fields
        const totalWaterRecycled = String(getRandomFloat(0.1, 50.0, 2)); // Liters
        const totalUsage = String(getRandomInt(1, 15)); // Number of uses
        const ttl = Math.floor(recordTime.getTime() / 1000); // Unix timestamp in seconds (as it's BIGINT, assuming seconds)
        const lon = String(getRandomFloat(75.7, 76.0, 5)); // Jaipur longitude range
        const lat = String(getRandomFloat(26.8, 27.0, 5)); // Jaipur latitude range
        const nh3Concentration = String(getRandomFloat(0.1, 5.0, 2)); // PPM
        const coConcentration = String(getRandomFloat(0.1, 10.0, 2)); // PPM
        const ch4Concentration = String(getRandomFloat(0.1, 20.0, 2)); // PPM
        const sendToDevice = getRandomElement(['True', 'False']);
        const fanHealth = getRandomElement(['Good', 'Fair', 'Poor']);
        const initiated = getRandomElement(['True', 'False']);
        const isDeviceStolen = getRandomElement(['True', 'False']);
        const versionCode = getRandomInt(100, 500);
        const sendToAws = getRandomElement(['True', 'False']);
        const floorCleanHealth = getRandomElement(['Good', 'Fair', 'Poor']);
        const freshwaterLevel = String(getRandomFloat(10.0, 100.0, 2)); // Percentage or Liters
        const lightHealth = getRandomElement(['Good', 'Fair', 'Poor']);
        const luminosityStatus = getRandomElement(['Bright', 'Normal', 'Dim', 'Dark']);
        const averageFeedback = String(getRandomFloat(1.0, 5.0, 1)); // Average feedback score (e.g., 1-5)
        const recycleWaterLevel = String(getRandomFloat(0.0, 80.0, 2)); // Percentage or Liters
        const flushHealth = getRandomElement(['Good', 'Fair', 'Poor']);


        recordsToInsert.push({
          cabin_id: cabinId,
          CLIENT: client,
          TotalWaterRecycled: totalWaterRecycled,
          TotalUsage: totalUsage,
          ttl: ttl,
          Lon: lon,
          NH3concentration: nh3Concentration,
          COconcentration: coConcentration,
          SHORT_THING_NAME: shortThingName,
          // ShortThingName: shortThingName, // Assuming this is a duplicate or typo for SHORT_THING_NAME
          SendToDevic: sendToDevice,
          Fanhealth: fanHealth,
          Lat: lat,
          INITIATED: initiated,
          IsDeviceStolen: isDeviceStolen,
          version_code: versionCode,
          SendToAws: sendToAws,
          Floorcleanhealth: floorCleanHealth,
          Freshwaterlevel: freshwaterLevel,
          Lighthealth: lightHealth,
          LuminosityStatus: luminosityStatus,
          ThingName: thingName, // Using ThingName as per the model
          AverageFeedback: averageFeedback,
          Recyclewaterlevel: recycleWaterLevel,
          COMPLEX: complex,
          // THING_NAME: thingName, // Assuming this is a duplicate or typo for ThingName
          CH4concentration: ch4Concentration,
          Flushhealth: flushHealth,
          created_at: recordTime, // Set created_at to the historical date/time
        });
      }
    }
  }

  console.log(`Attempting to insert ${recordsToInsert.length} UsageAndFeedback records for Jaipur, Rajasthan (historical created_at)...`);

  try {
    await UsageAndFeedback.bulkCreate(recordsToInsert);
    console.log(`Successfully inserted ${recordsToInsert.length} UsageAndFeedback records.`);
    return { success: true, count: recordsToInsert.length };
  } catch (error) {
    console.error('Error inserting UsageAndFeedback records:', error);
    return { success: false, error: error.message };
  }
};


// generateAndInsertUsageAndFeedbackData()