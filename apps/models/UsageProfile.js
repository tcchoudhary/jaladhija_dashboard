// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/database");
// const cron = require("node-cron");

// const UsageProfile = sequelize.define(
//   "UsageProfile",
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     cabin_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     CLIENT: DataTypes.STRING,
//     CITY: DataTypes.STRING,
//     STATE: DataTypes.STRING,
//     COMPLEX: DataTypes.STRING,
//     SHORT_THING_NAME: DataTypes.STRING,
//     THING_NAME: DataTypes.STRING,
//     Fantime: DataTypes.STRING,
//     Lighttime: DataTypes.STRING,
//     Manualflush: DataTypes.STRING,
//     Floorclean: DataTypes.STRING,
//     Miniflush: DataTypes.STRING,
//     Preflush: DataTypes.STRING,
//     Fullflush: DataTypes.STRING,
//     Airdryer: DataTypes.STRING,
//     RFID: DataTypes.STRING,
//     feedback: DataTypes.STRING,
//     Entrytype: DataTypes.STRING,
//     Duration: DataTypes.STRING,
//     START_TIME: DataTypes.BIGINT,
//     Amountcollected: DataTypes.STRING,
//     Amountremaining: DataTypes.STRING,
//     created_at: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW, // यह अब सिर्फ तारीख देगा
//     },
//   },
//   {
//     tableName: "UsageProfile",
//     timestamps: false,
//   }
// );

// module.exports = UsageProfile;

// async function insertDailyUsageRecords() {
//   try {
//     const usageRecordsToInsert = [];
//     const baseData = {
//       CLIENT: "GSCDCL_PH2",
//       CITY: "MP1404",
//       Characteristic: "",
//       feedback: "Not Given",
//       Entrytype: "0",
//       Floorclean: "0",
//       RFID: "0",
//       Amountcollected: "0",
//       Amountremaining: "0",
//       COMPLEX: "1000_BED_HOSPITAL",
//       STATE: "MP",
//     };

//     const totalCabins = 40;
//     const today = new Date();
//     const todayFormatted = today.toISOString().split("T")[0];

//     let recordsInsertedCount = 0;

//     for (let cabinId = 1; cabinId <= totalCabins; cabinId++) {
//       const shortThingName = `FWC_${String(cabinId).padStart(3, "0")}`;
//       const thingName = `MP1404_23072024_003_${shortThingName}`;

//       const numberOfUsages = Math.floor(Math.random() * (5 - 2 + 1)) + 2;

//       for (let i = 0; i < numberOfUsages; i++) {
//         const entryTime = new Date(today);
//         entryTime.setHours(
//           Math.floor(Math.random() * 24),
//           Math.floor(Math.random() * 60),
//           Math.floor(Math.random() * 60),
//           Math.floor(Math.random() * 999)
//         );

//         const duration = String(
//           Math.floor(Math.random() * (1200 - 10 + 1)) + 10
//         );
//         const fantime = String(
//           Math.floor(parseInt(duration) * (0.8 + Math.random() * 0.2))
//         );
//         const lighttime = String(
//           Math.floor(parseInt(duration) * (0.8 + Math.random() * 0.2))
//         );

//         const preflush = Math.random() < 0.2 ? "1" : "0";
//         const fullflush = Math.random() < 0.7 ? "1" : "0";
//         const miniflush = Math.random() < 0.1 ? "1" : "0";
//         const airdryer = Math.random() < 0.3 ? "1" : "0";

//         const startTimeMillis = entryTime.getTime() - parseInt(duration) * 1000;

//         usageRecordsToInsert.push({
//           cabin_id: cabinId,
//           CLIENT: baseData.CLIENT,
//           CITY: baseData.CITY,
//           STATE: baseData.STATE,
//           COMPLEX: baseData.COMPLEX,
//           SHORT_THING_NAME: shortThingName,
//           THING_NAME: thingName,
//           Fantime: fantime,
//           Lighttime: lighttime,
//           Manualflush: "0",
//           Floorclean: Floorclean,
//           Miniflush: miniflush,
//           Preflush: preflush,
//           Fullflush: fullflush,
//           Airdryer: airdryer,
//           RFID: baseData.RFID,
//           feedback: baseData.feedback,
//           Entrytype: baseData.Entrytype,
//           Duration: duration,
//           START_TIME: startTimeMillis,
//           Amountcollected: baseData.Amountcollected,
//           Amountremaining: baseData.Amountremaining,
//           created_at: todayFormatted,
//         });
//         recordsInsertedCount++;
//       }
//     }

//     if (usageRecordsToInsert.length > 0) {
//       await UsageProfile.bulkCreate(usageRecordsToInsert);
//     } else {
//       console.log("आज के लिए कोई नया उपयोग रिकॉर्ड इंसर्ट नहीं किया गया।");
//     }
//   } catch (error) {
//     console.error("उपयोग डेटा डालने में त्रुटि:", error);
//   }
// }

// async function cleanOldUsageRecords() {
//   try {
//     const uniqueDatesCount = await UsageProfile.count({
//       distinct: true,
//       col: sequelize.fn("DATE", sequelize.col("created_at")),
//     });
//     if (uniqueDatesCount > 90) {
//       const cutoffDate = new Date();
//       cutoffDate.setDate(cutoffDate.getDate() - 90);
//       cutoffDate.setHours(0, 0, 0, 0);

//       console.log(
//         `UsageProfile में 90 दिन से ज्यादा का डेटाबेस है (${uniqueDatesCount} दिन)। ${
//           cutoffDate.toISOString().split("T")[0]
//         } से पहले के रिकॉर्ड्स डिलीट किए जा रहे हैं।`
//       );

//       const deletedCount = await UsageProfile.destroy({
//         where: {
//           created_at: {
//             [Op.lt]: cutoffDate,
//           },
//         },
//       });
//       console.log(
//         `${deletedCount} पुराने रिकॉर्ड्स UsageProfile टेबल से डिलीट हो गए हैं।`
//       );
//     } else {
//       console.log(
//         "UsageProfile में 90 दिनों से अधिक का डेटा नहीं है। पुराने रिकॉर्ड्स डिलीट नहीं किए गए।"
//       );
//     }
//   } catch (error) {
//     console.error("पुराने उपयोग रिकॉर्ड्स डिलीट करने में त्रुटि:", error);
//   }
// }

// async function startApplication() {
//   try {
//     await sequelize.authenticate();

//     await UsageProfile.sync({ alter: true });

//     cron.schedule(
//       "31 9 * * *",
//       async () => {
//         await insertDailyUsageRecords();
//       },
//       {
//         scheduled: true,
//         timezone: "Asia/Kolkata",
//       }
//     );

//     cron.schedule(
//       "31 9 * * *",
//       async () => {
//         await cleanOldUsageRecords();
//       },
//       {
//         scheduled: true,
//         timezone: "Asia/Kolkata",
//       }
//     );
//   } catch (error) {
//     console.error("एप्लिकेशन शुरू करने में गंभीर त्रुटि:", error);
//     process.exit(1);
//   }
// }

// startApplication();

const { DataTypes, Op } = require("sequelize"); // Op को यहाँ से इम्पोर्ट करें
const sequelize = require("../config/database");
const cron = require("node-cron");

const UsageProfile = sequelize.define(
  "UsageProfile",
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
        model: "Cabins", // Reference to Cabins table
        key: "id",
      },
    },
    CLIENT: DataTypes.STRING,
    CITY: DataTypes.STRING,
    STATE: DataTypes.STRING,
    COMPLEX: DataTypes.STRING,
    SHORT_THING_NAME: DataTypes.STRING,
    THING_NAME: DataTypes.STRING,
    Fantime: DataTypes.STRING,
    Lighttime: DataTypes.STRING,
    Manualflush: DataTypes.STRING,
    Floorclean: DataTypes.STRING,
    Miniflush: DataTypes.STRING,
    Preflush: DataTypes.STRING,
    Fullflush: DataTypes.STRING,
    Airdryer: DataTypes.STRING,
    RFID: DataTypes.STRING,
    feedback: DataTypes.STRING,
    Entrytype: DataTypes.STRING,
    Duration: DataTypes.STRING,
    Entry_TIME: DataTypes.BIGINT,
    Exit_TIME: DataTypes.BIGINT,
    Amountcollected: DataTypes.STRING,
    Amountremaining: DataTypes.STRING,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "UsageProfile",
    timestamps: false,
  }
);


module.exports = UsageProfile;

// (async () => {
//   try {
//     // Jitni bhi "average" type values hain
//     await UsageProfile.update(
//       { feedback: "average" },
//       {
//         where: {
//           feedback: {
//             [Op.in]: ["avg", "Average", "mediocre", "okay", "normal"], // tumhare purane values
//           },
//         },
//       }
//     );

//     // Jitni bhi "good" type values hain
//     await UsageProfile.update(
//       { feedback: "good" },
//       {
//         where: {
//           feedback: {
//             [Op.in]: ["good", "very good", "excellent", "Untidy","Clean"],
//           },
//         },
//       }
//     );

//     // Jitni bhi "bad" type values hain
//     await UsageProfile.update(
//       { feedback: "bad" },
//       {
//         where: {
//           feedback: {
//             [Op.in]: ["bad", "poor", "worst", "terrible"],
//           },
//         },
//       }
//     );

//     console.log("✅ Feedback normalized successfully!");
//   } catch (err) {
//     console.error("❌ Error while updating feedback:", err);
//   }
// })();













// usageProfileGenerator.js - THIS VERSION GENERATES 36,000 RECORDS
// (10 records PER CABIN, PER DAY, for 40 cabins, over 90 days)








// generateAndInsertUsageData()



// Helper function to get a random integer within a range
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to get a random element from an array
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateAndInsertUsageData = async () => {
  const numDays = 90;
  const numCabins = 40; // Total number of cabin IDs (1 to 40)
  const entriesPerCabinPerDay = 5; // Key: 10 records FOR EACH CABIN, FOR EACH DAY

  // Fixed current time for "today's" reference: Sunday, July 20, 2025 at 3:37:16 AM IST.
  // All historical dates will be calculated backwards from this point.
  const now = new Date('2025-07-20T03:37:16+05:30'); // +05:30 for IST

  // --- FIXED LOCATION DETAILS (Jaipur, Rajasthan, as per your context) ---
     const fixedCity = "Gwalior";
  const fixedState = "Madhya Pradesh";
  const fixedClient = "MP_Clients_A";
  const fixedComplex = "MP_Clients_A";

  const feedbacks = ["Excellent", "Good", "Average", "Poor", "Very Good", "Clean", "Untidy"];
  const entryTypes = ["RFID", "Manual", "Biometric", "QR Code"];

  const recordsToInsert = [];

  for (let dayOffset = 0; dayOffset < numDays; dayOffset++) {
    // Calculate the specific historical date for this iteration.
    const currentDay = new Date(now); // Start with the fixed 'now' date
    currentDay.setDate(now.getDate() - dayOffset); // Subtract days to get the historical date
    currentDay.setHours(0, 0, 0, 0); // Set time to beginning of the day for consistency in historical context

    for (let cabinId = 1; cabinId <= numCabins; cabinId++) { // Loop through EACH of the 40 cabins
      // Use the fixed values for all records
      const client = fixedClient;
      const city = fixedCity;
      const state = fixedState;
      const complex = fixedComplex;

      const shortThingName = `JPR_C${cabinId}`;
      const thingName = `CABIN_${cabinId}_JAIPUR`;

      for (let entryNum = 0; entryNum < entriesPerCabinPerDay; entryNum++) { // Generate 10 entries for THIS specific cabin on THIS specific day
        // Generate entry and exit times for the current `currentDay`
        const entryHour = getRandomInt(6, 22); // Between 6 AM and 10 PM
        const entryMinute = getRandomInt(0, 59);
        const entrySecond = getRandomInt(0, 59);

        const entryTime = new Date(currentDay); // Base Entry_TIME on `currentDay`
        entryTime.setHours(entryHour, entryMinute, entrySecond, getRandomInt(0, 999)); // Add milliseconds

        // Duration between 1 minute (60000ms) and 30 minutes (1800000ms)
        const durationMs = getRandomInt(60000, 1800000);
        const exitTime = new Date(entryTime.getTime() + durationMs);

        recordsToInsert.push({
          cabin_id: cabinId,
          CLIENT: client,
          CITY: city,
          STATE: state,
          COMPLEX: complex,
          SHORT_THING_NAME: shortThingName,
          THING_NAME: thingName,
          Fantime: String(getRandomInt(0, 300)),
          Lighttime: String(getRandomInt(0, 180)),
          Manualflush: String(getRandomInt(0, 1)),
          Floorclean: String(getRandomInt(0, 1)),
          Miniflush: String(getRandomInt(0, 1)),
          Preflush: String(getRandomInt(0, 1)),
          Fullflush: String(getRandomInt(0, 1)),
          Airdryer: String(getRandomInt(0, 60)),
          RFID: `RFID_${getRandomInt(10000, 99999)}`,
          feedback: getRandomElement(feedbacks),
          Entrytype: getRandomElement(entryTypes),
          Duration: String(Math.round(durationMs / 60000 * 100) / 100), // Duration in minutes, 2 decimal places
          Entry_TIME: entryTime.getTime(),   // Unix timestamp in milliseconds for entry
          Exit_TIME: exitTime.getTime(),     // Unix timestamp in milliseconds for exit
          Amountcollected: String(getRandomElement([0, 5, 10, 20])),
          Amountremaining: String(getRandomElement([0, 0, 0, 5])),
          // --- THE CRITICAL CORRECTION IS HERE: ---
          created_at: entryTime, // Set created_at to the same historical date/time as the entry
        });
      }
    }
  }

  console.log(`Attempting to insert ${recordsToInsert.length} records for Jaipur, Rajasthan (historical created_at)...`);

  try {
    // Before bulkCreate, ensure 'created_at' in the model definition does NOT have 'defaultValue: DataTypes.NOW'.
    // If it does, Sequelize might override your custom value.
    // Ensure your UsageProfile model has `timestamps: false` and no `defaultValue` for `created_at`.
    await UsageProfile.bulkCreate(recordsToInsert);
    console.log(`Successfully inserted ${recordsToInsert.length} UsageProfile records with historical 'created_at' values for Jaipur, Rajasthan.`);
    return { success: true, count: recordsToInsert.length };
  } catch (error) {
    console.error('Error inserting UsageProfile records:', error);
    return { success: false, error: error.message };
  }
};

// generateAndInsertUsageData()

