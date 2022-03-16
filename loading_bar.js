// DONATION BAR
var donation = 0; // Track overall donations
var goal = 0; // Overall goal
var goalSegments = 0; // Goal split into segments
var currentDonation = 0;
var percent = 0; // Percentage of donations out of a current goal segment
var maxLevel = 12; // Maximum levels to break through
var fields;
var goal_values = [];
var index = 1;
//** LOAD IN INITIAL WIDGET DATA
//*
//*
window.addEventListener('onWidgetLoad', function (obj) {
  // Get base data
  let data = obj["detail"]["session"]["data"];
  const fieldData = obj["detail"]["fieldData"];
  fields = fieldData;
  // Set initial goal data
  donation = data["tip-goal"]["amount"];

  for(let i=0;i<12;i++){
    if(fieldData["level_"+(i+1)+"_value"] == null) continue;
    goal_values.push(fieldData["level_"+(i+1)+"_value"])
  }
  // Set goal live
  reloadGoal();
});

//** UPDATE INFO WIDGET INFORMATION
//
//
window.addEventListener('onEventReceived', function (obj) {
  const listener = obj.detail.listener;
  const event = obj["detail"]["event"];

  if ( listener == 'tip-latest' ) {
    console.log("DON : "+ event["amount"])

    donation = donation + event["amount"];
    // Donation bar
    reloadGoal();
  }
});

function viewStates(method){
  console.log("METHODE : "+method)
  console.log("index : "+index)

  console.log("currentDonation : "+currentDonation)
  console.log("donation : "+donation)
  console.log("goal : "+goal)
  console.log("goalSegments : "+goalSegments)
  console.log("percent : "+percent)
}

function sumGoalValues(index){
  let result = 0;
  if(index-1 > 0){
    for(let i=0;i<index-1;i++){
      result+=goal_values[i]
    }
  }
  return result;
}
//** CALCULATION FUNCTIONS FOR DONATIONS BAR
//
//
function reloadGoal() {
  currentDonation = index == 1 ?donation : Math.abs(sumGoalValues(index)-donation);
  viewStates("reloadGoal 1")

  while(currentDonation > goal_values[index-1]) {
    index++
    currentDonation = index == 1 ?donation : Math.abs(sumGoalValues(index)-donation);
  }

  goalSegments = goal_values[index-1];

  label = levelLabel( index, fields );


  $('#progress .loading .amount').text( '$' + currentDonation );

  // Get goal segment amount
  $('#progress .endgame .amount').text( '$' + goalSegments !=null? goalSegments : 100000000000 );
  // Set percent

  viewStates("reloadGoal 2")

  percent = doPercent();
  // Update goal bar
  $('#progress .loading').css(
    {
      'width': percent + '%'
    });
  $('#progress #current_level').text( index );
  $('#progress #current_goal').text( label );
  $('#progress #num_goals').text( goal_values.length );

}

function levelLabel( level, fields ) {
  var labelName = 'level_' + level;
  var label = fields[labelName];
  return label;
}

function doPercent( ) {
  console.log(currentDonation+" - "+goalSegments)
  let perc = currentDonation / goalSegments;
  let amount = perc * 100;
  if ( amount < 10 ) {
    amount = 10;
  }
  if ( amount > 100 ) {
    amount = 100;
  }
  return amount;
}
