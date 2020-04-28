function make_slides(f) {
  var   slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });

  slides.instructions = slide({
    name : "instructions",
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.trial = slide({
    name: "trial",
    start: function() {

    },
    present: exp.stims,
    present_handle: function(stim) {
      $('input[name="sentence_seen"]').prop("checked", false);
      $("#sentence_response").val('') //j-query 
      $(".sentence_err_text").hide();
      $(".sentence_err_button").hide();
      
      this.stim = stim;
      $(".sentence_prompt").html(stim.sentence);

      $("#picture_trial").hide();
/*
      $("#picture_instr").hide();
      $("#picture_response").hide();
      $(".picture_err_text").hide();
      $("#seen_picture_before").hide();
      $("#no_picture").hide();
      $("#yes_picture").hide();
      $('input[name="picture_seen"]').hide();
      $(".picture_err_button").hide()
      */
    },

    second_slide : function() {
      exp.sent_text_response = $("#sentence_response").val();
      exp.sent_button_response = $('input[name="sentence_seen"]:checked').val();
      if (exp.sent_text_response.length == 0) {
        $(".sentence_err_text").show();
      } else if (exp.sent_button_response == null)  {
        $(".sentence_err_button").show();
      } else {
        $("#sentence_trial").hide();
        $("#picture_trial").show();
        $(".picture_err_text").hide();
        $(".picture_err_button").hide();
      }
    }, 

    button : function() {
      pic_text_response = $("#picture_response").val();
      pic_button_response = $('input[name="picture_seen"]:checked').val();
      if (pic_text_response.length == 0) {
        $(".picture_err_text").show();
      } else if(pic_button_response == null) {
        $(".picture_err_button").show();
      } else {
        exp.data_trials.push({
          "trial_type" : "trial",
          "slide_number" : exp.phase, 
          "condition" : this.stim.condition,
          "item": this.stim.item,
          "sentence" : this.stim.sentence,
          "response" : [exp.sent_text_response, 
                        exp.sent_button_response, 
                        pic_text_response, 
                        pic_button_response] 
        });
        _stream.apply(this);
        //exp.go();
      }
    },

  });

slides.picture_trial = slide({
  name : "picture_trial"
}
/*
   start: function() {

  },
  present: exp.pictures,
  present_handle : function(stim) {
    var image = "<img src="images/target_pictures" + stim.figure + ".jpg" style="height:300px" class="center">;
    $(".image").html(image);*/

  );
  
  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language : $("#language").val(),
        enjoyment : $("#enjoyment").val(),
        asses : $('input[name="assess"]:checked').val(),
        age : $("#age").val(),
        gender : $("#gender").val(),
        education : $("#education").val(),
        comments : $("#comments").val(),
        problems: $("#problems").val(),
        fairprice: $("#fairprice").val()
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.thanks = slide({
    name : "thanks",
    start : function() {
      exp.data= {
          "trials" : exp.data_trials,
          "catch_trials" : exp.catch_trials,
          "system" : exp.system,
          "condition" : exp.condition,
          "subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });

  return slides;
}

/// init ///
function init() {
  exp.trials = [];
  exp.catch_trials = [];
  exp.condition = _.sample(["passive", "by-locative", "non-by-locative"]); //can randomize between subject conditions here
  
  var items = [
    {item: "senator", condition: "passive", sentence: "The senator was awed by the statue."},
    {item: "senator", condition: "active", sentence: "The senator unveiled the statue."},
    {item: "senator", condition: "by-locative", sentence: "The senator was speaking by the statue."},
    {item: "senator", condition: "non-by-locative", sentence: "The senator has spoken about the statue."},
    {item: "woman", condition: "passive", sentence: "The woman was stung by the jellyfish."},
    {item: "woman", condition: "active", sentence: "The woman caught the jellyfish."},
    {item: "woman", condition: "by-locative", sentence: "The woman was swimming by the jellyfish."},
    {item: "woman", condition: "non-by-locative", sentence: "The woman has swum into the jellyfish."},
    {item: "prisoner", condition: "passive", sentence: "The escaping prisoner was illuminated by the guard tower."},
    {item: "prisoner", condition: "active", sentence: "The escaping prisoner avoided the guard tower."},
    {item: "prisoner", condition: "by-locative", sentence: "The escaping prisoner was hiding by the guard tower."},
    {item: "prisoner", condition: "non-by-locative", sentence: "The escaping prisoner has hidden below the guard tower."},
    {item: "foreigner", condition: "passive", sentence: "The foreigner was confused by the blinking traffic light."},
    {item: "foreigner", condition: "active", sentence: "The foreigner misunderstood the blinking traffic light."},
    {item: "foreigner", condition: "by-locative", sentence: "The foreigner was loitering by the blinking traffic light."},
    {item: "foreigner", condition: "non-by-locative", sentence: "The foreigner has loitered at the blinking traffic light."},
    {item: "Dalmatian", condition: "passive", sentence: "The Dalmatian was pursued by the fire truck."},
    {item: "Dalmatian", condition: "active", sentence: "The Dalmatian chased the fire truck."},
    {item: "Dalmatian", condition: "by-locative", sentence: "The Dalmatian was running by the fire truck."},
    {item: "Dalmatian", condition: "non-by-locative", sentence: "The Dalmatian has run around the fire truck."},
    {item: "secretary", condition: "passive", sentence: "The secretary was splashed by the drinking fountain."},
    {item: "secretary", condition: "active", sentence: "The secretary cleaned the drinking fountain."},
    {item: "secretary", condition: "by-locative", sentence: "The secretary was tripping by the drinking fountain."},
    {item: "secretary", condition: "non-by-locative", sentence: "The secretary has tripped near the drinking fountain."},
    {item: "worker", condition: "passive", sentence: "The construction worker was hit by the bulldozer."},
    {item: "worker", condition: "active", sentence: "The construction worker drove the bulldozer."},
    {item: "worker", condition: "by-locative", sentence: "The construction worker was digging by the bulldozer."},
    {item: "worker", condition: "non-by-locative", sentence: "The construction worker has dug with the bulldozer."},
    {item: "graduate", condition: "passive", sentence: "The new graduate was hired by the software company."},
    {item: "graduate", condition: "active", sentence: "The new graduate joined the software company."},
    {item: "graduate", condition: "by-locative", sentence: "The new graduate was driving by the software company."},
    {item: "graduate", condition: "non-by-locative", sentence: "The new graduate has driven around the software company."},
    {item: "ship", condition: "passive", sentence: "The ship was damaged by the pier."},
    {item: "ship", condition: "active", sentence: "The ship approached the pier."},
    {item: "ship", condition: "by-locative", sentence: "The ship was docking by the pier."},
    {item: "ship", condition: "non-by-locative", sentence: "The ship has docked at the pier."},
    {item: "minister", condition: "passive", sentence: "The minister was cut by the broken stained glass window."},
    {item: "minister", condition: "active", sentence: "The minister fixed the broken stained glass window." },
    {item: "minister", condition: "by-locative", sentence: "The minister was praying by the broken stained glass window."},
    {item: "minister", condition: "non-by-locative", sentence: "The minister has prayed below the broken stained glass wind"},
    {item: "engineers", condition: "passive", sentence: "The engineers were appalled by the monument."},
    {item: "engineers", condition: "active", sentence: "The engineers criticized the monument."},
    {item: "engineers", condition: "by-locative", sentence: "The engineers were conferring by the monument."},
    {item: "engineers", condition: "non-by-locative", sentence: "The engineers have conferred at the monument."},
    {item: "lumberjack", condition: "passive", sentence: "The lumberjack was struck by the giant redwood tree."},
    {item: "lumberjack", condition: "active", sentence: "The lumberjack struck the giant redwood tree."},
    {item: "lumberjack", condition: "by-locative", sentence: "The lumberjack was resting by the giant redwood tree."},
    {item: "lumberjack", condition: "non-by-locative", sentence: "The lumberjack has rested inside the giant redwood tree."},
    {item: "students", condition: "passive", sentence: "The students were bankrupted by the new sports complex."},
    {item: "students", condition: "active", sentence: "The students tried the new sports complex."},
    {item: "students", condition: "by-locative", sentence: "The students were working by the new sports complex."},
    {item: "students", condition: "non-by-locative", sentence: "The students have worked in the new sports complex."},
    {item: "747", condition: "passive", sentence: "The 747 was radioed by the airport control tower."},
    {item: "747", condition: "active", sentence: "The 747 radioed the airport control tower."},
    {item: "747", condition: "by-locative", sentence: "The 747 was landing by the airport control tower."},
    {item: "747", condition: "non-by-locative", sentence: "The 747 has landed near the airport control tower."},
    {item: "geologist", condition: "passive", sentence: "The missing geologist was smothered by the volcano."},
    {item: "geologist", condition: "active", sentence: "The missing geologist underestimated the volcano."},
    {item: "geologist", condition: "by-locative", sentence: "The missing geologist was wandering by the volcano."},
    {item: "geologist", condition: "non-by-locative", sentence: "The missing geologist has wandered into the volcano."},
    {item: "scouts", condition: "passive", sentence: "The Cub Scouts were warmed by the campfire."},
    {item: "scouts", condition: "active", sentence: "The Cub Scouts enjoyed the camp fire."},
    {item: "scouts", condition: "by-locative", sentence: "The Cub Scouts were singing by the campfire."},
    {item: "scouts", condition: "non-by-locative", sentence: "The Cub Scouts have sung around the campfire."},
    {item: "princess", condition: "passive", sentence: "The princess was delighted by the palace's old gate."},
    {item: "princess", condition: "active", sentence: "The princess renovated the palace's old gate."},
    {item: "princess", condition: "by-locative", sentence: "The princess was daydreaming by the palace's old gate."},
    {item: "princess", condition: "non-by-locative", sentence: "The princess has daydreamed under the palace's old gate."},
    {item: "stockbroker", condition: "passive", sentence: "The stockbroker was sued by the client."},
    {item: "stockbroker", condition: "active", sentence: "The stockbroker impressed the client."},
    {item: "stockbroker", condition: "by-locative", sentence: "The stockbroker was sitting by the client."},
    {item: "stockbroker", condition: "non-by-locative", sentence: "The stockbroker has sat opposite the client."},
    {item: "businessman", condition: "passive", sentence: "The businessman was paged by the airline ticket counter."},
    {item: "businessman", condition: "active", sentence: "The businessman left the airline ticket counter."},
    {item: "businessman", condition: "by-locative", sentence: "The businessman was waiting by the airline ticket counter."},
    {item: "businessman", condition: "non-by-locative", sentence: "The businessman has waited behind the airline ticket count."},
    {item: "scientist", condition: "passive", sentence: "The scientist was inspired by the apple tree."},
    {item: "scientist", condition: "active", sentence: "The scientist examined the apple tree."},
    {item: "scientist", condition: "by-locative", sentence: "The scientist was sleeping by the apple tree."},
    {item: "scientist", condition: "non-by-locative", sentence: "The scientist has slept under the apple tree."},
    {item: "surfer", condition: "passive", sentence: "The surfer was excited by the stormy sea."},
    {item: "surfer", condition: "active", sentence: "The surfer watched the stormy sea."},
    {item: "surfer", condition: "by-locative", sentence: "The surfer was sprinting by the stormy sea."},
    {item: "surfer", condition: "non-by-locative", sentence: "The surfer has sprinted along the stormy sea."},
    {item: "patron", condition: "passive", sentence: "The patron was annoyed by the jukebox in the bar."},
    {item: "patron", condition: "active", sentence: "The patron destroyed the jukebox in the bar."},
    {item: "patron", condition: "by-locative", sentence: "The patron was drinking by the jukebox in the bar."},
    {item: "patron", condition: "non-by-locative", sentence: "The patron has drunk at the jukebox in the bar."},
    {item: "lady", condition: "passive", sentence: "The bag lady was caught by the revolving door."},
    {item: "lady", condition: "active", sentence: "The bag lady stopped the revolving door."},
    {item: "lady", condition: "by-locative", sentence: "The bag lady was falling by the revolving door."},
    {item: "lady", condition: "non-by-locative", sentence: "The bag lady has fallen in the revolving door."},
    {item: "dictator", condition: "passive", sentence: "The dictator was overthrown by the general."},
    {item: "dictator", condition: "active", sentence: "The dictator trusted the general."},
    {item: "dictator", condition: "by-locative", sentence: "The dictator was standing by the general."},
    {item: "dictator", condition: "non-by-locative", sentence: "The dictator has stood behind the general."},
    {item: "children", condition: "passive", sentence: "The children were deafened by the church organ."},
    {item: "children", condition: "active", sentence: "The children disliked the church organ."},
    {item: "children", condition: "by-locative", sentence: "The children were playing by the church organ."},
    {item: "children", condition: "non-by-locative", sentence: "The children have played beside the church organ."},
    {item: "fishermen", condition: "passive", sentence: "The fishermen were startled by the buoy."},
    {item: "fishermen", condition: "active", sentence: "The fishermen damaged the buoy."},
    {item: "fishermen", condition: "by-locative", sentence: "The fishermen were fishing by the buoy."},
    {item: "fishermen", condition: "non-by-locative", sentence: "The fishermen have fished at the buoy."},
    {item: "young_woman", condition: "passive", sentence: "The young woman was calmed by the lake."},
    {item: "young_woman", condition: "active", sentence: "The young woman admired the lake."},
    {item: "young_woman", condition: "by-locative", sentence: "The young woman was walking by the lake."},
    {item: "young_woman", condition: "non-by-locative", sentence: "The young woman has walked along the lake."},
    {item: "bum", condition: "passive", sentence: "The bum was scratched by the bushes."},
    {item: "bum", condition: "active", sentence: "The bum circled the bushes."},
    {item: "bum", condition: "by-locative", sentence: "The bum was napping by the bushes."},
    {item: "bum", condition: "non-by-locative", sentence: "The bum has napped in the bushes."},
    {item: "dog", condition: "passive", sentence: "The dog was protected by the fence."},
    {item: "dog", condition: "active", sentence: "The dog jumped the fence."},
    {item: "dog", condition: "by-locative", sentence: "The dog was barking by the fence."},
    {item: "dog", condition: "non-by-locative", sentence: "The dog has barked behind the fence."},
    {item: "grandmother", condition: "passive", sentence: "The grandmother was pleased by the flowers."},
    {item: "grandmother", condition: "active", sentence: "The grandmother liked the flowers."},
    {item: "grandmother", condition: "by-locative", sentence: "The grandmother was sketching by the flowers."},
    {item: "grandmother", condition: "non-by-locative", sentence: "The grandmother has sketched near the flowers."},
    {item: "councilman", condition: "passive", sentence: "The councilman was impressed by the new building."},
    {item: "councilman", condition: "active", sentence: "The councilman opened the new building."},
    {item: "councilman", condition: "by-locative", sentence: "The councilman was strolling by the new building."},
    {item: "councilman", condition: "non-by-locative", sentence: "The councilman has strolled past the new building."},
    {item: "nymphs", condition: "passive", sentence: "The nymphs were soaked by the waterfall."},
    {item: "nymphs", condition: "active", sentence: "The nymphs saw the waterfall."},
    {item: "nymphs", condition: "by-locative", sentence: "The nymphs were bathing by the waterfall."},
    {item: "nymphs", condition: "non-by-locative", sentence: "The nymphs have bathed under the waterfall."}
  ]; 

  var images = [ 
  //sequence of numbers
  ]

// function that takes an input array of items
// dependening on which condition, creates list of items
// loop that goes from 1 to number of trials
// push stimuli to overall stimuli array 
// for each sentence shuffle through image array
// text field images: make prod stim 

  exp.stims = _.shuffle(items);

  var filler_sentences = [    
    ["The man looked at himself in the mirror.","reflexive1","orig"],
    ["They basketball players tripped themselves on the court.","reflexive2","orig"],
    ["The little girl splashed herself in the puddle.","reflexive3","orig"],
    ["The freezing rain made the streets slippery.","causative1","orig"],
    ["Thinking too hard makes me tired.","causative2","orig"],
    ["It was an old lady who discovered the weapon.","cleft1","orig"],
    ["It was a stray cat that was on the fire escape.","cleft2","orig"],
    ["It was my old friend who was in the parade.","cleft3","orig"],
    ["There is a red spot on Jupiter.","existential1","orig"],
    ["There are seven days in a week.","existential2","orig"],
    ["There is no life on Mars.","existential3","orig"],
    ["The girl laughed herself silly.","resultative-reflexive1","orig"],
    ["The little boy scrubbed himself clean.","resultative-reflexive2","orig"],
    ["The women sat themselves down at the far table.","resultative-reflexive3","orig"],
    ["All humans are animals.","generic1","orig"],
    ["Argentina is in South America.","generic2","orig"],
    ["Mercury is the closest planet to the sun.","generic3","orig"],
    ["Running is a form of exercise.","generic4","orig"],
    ["The mechanic brought the driver a jumper cable.","ditransitive1","orig"],
    ["The coach handed the player a towel.","ditransitive2","orig"],
    ["The singer gave the piano player a wave.","ditransitive-light1","orig"],
    ["The show master gave a smile to the audience.","ditransitive-light2","orig"],
    ["The town board gave the green light to the land developers.","ditransitive-idiom1","orig"],
    ["The teacher gave the board of education a piece of his mind.","ditransitive-idiom2","orig"],
    ["The new employee felt like a fish out of water.","idiom1","orig"],
    ["The girl thought it was the best thing since sliced bread.","idiom2","orig"],
    ["Money is the root of all evil.","idiom3","orig"],
    ["The graceful young girl danced.","intrans1","orig"],
    ["The stars glittered.","intrans2","orig"],
    ["The rusty car engine sputtered.","intrans3","orig"],
    ["The child's fish died.","intrans4","orig"],
    ["The novelist wrote tirelessly.","intrans+adverb1","orig"],
    ["The time passed slowly.","intrans+adverb2","orig"],
    ["The disease spread rapidly.","intrans+adverb3","orig"],
    ["The athlete performed effortlessly.","intrans+adverb4","orig"],
    ["The man admitted that he was wrong.","intrans+complement1","orig"],
    ["The company claimed that their product was the best.","intrans+complement2","orig"],
    ["The salesman acknowledged that his rival's presentation was better.","intrans+complement3","orig"],
    ["The window shattered when the hurricane arrived.","intrans+subordinate1","orig"],
    ["The cook jumped when the hot soup splattered.","intrans+subordinate2","orig"],
    ["The food spoiled when the refrigerator broke.","intrans+subordinate3","orig"],
    ["The girl panicked when her car battery died.","intrans+subordinate4","orig"],
    ["The man looked at himself in the mirror.","reflexive1","rep"],
    ["They basketball players tripped themselves on the court.","reflexive2","rep"],
    ["The freezing rain made the streets slippery.","causative1","rep"],
    ["It was an old lady who discovered the weapon.","cleft1","rep"],
    ["It was a stray cat that was on the fire escape.","cleft2","orig"],
    ["There is a red spot on Jupiter.","existential1","rep"],
    ["There are seven days in a week.","existential2","rep"],
    ["The girl laughed herself silly.","resultative-reflexive1","rep"],
    ["The little boy scrubbed himself clean.","resultative-reflexive2","rep"],
    ["All humans are animals.","generic1","rep"],
    ["Argentina is in South America.","generic2","rep"],
    ["The mechanic brought the driver a jumper cable.","ditransitive1","rep"],
    ["The singer gave the piano player a wave.","ditransitive-light1","rep"],
    ["The town board gave the green light to the land developers.","ditransitive-idiom1","rep"],
    ["The new employee felt like a fish out of water.","idiom1","rep"],
    ["The girl thought it was the best thing since sliced bread.","idiom2","rep"],
    ["The graceful young girl danced.","intrans1","rep"],
    ["The stars glittered.","intrans2","rep"],
    ["The novelist wrote tirelessly.","intrans+adverb1","rep"],
    ["The time passed slowly.","intrans+adverb2","rep"],
    ["The disease spread rapidly.","intrans+adverb3","rep"],
    ["The man admitted that he was wrong.","intrans+complement1","rep"],
    ["The company claimed that their product was the best.","intrans+complement2","rep"],
    ["The window shattered when the hurricane arrived.","intrans+subordinate1","rep"],
    ["The cook jumped when the hot soup splattered.","intrans+subordinate2","rep"],
    ["The food spoiled when the refrigerator broke.","intrans+subordinate3","rep"],
];

  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };
  //blocks of the experiment:
  exp.structure=["i0", "instructions", "trial", 'subj_info', 'thanks'];

  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined

  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

  exp.go(); //show first slide
}

//format of error messages
//move continue before legal information 
//git add .
//git commit -m "Erika message"
// git push
// from Github page go to Settings, github pages, non -> master branch, wait, refresh page, git hub pages,  
