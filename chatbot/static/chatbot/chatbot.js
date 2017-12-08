var cur_node;
var cur_output;
var cur_input='';
var is_first = true;

var practice = false;

var dialog_id = "0"
var chat_input_wrong = "잘 못 말하고 있는 것 같아요"
var chat_output_wrong = "앗 실수해서 미안해요\n 어떻게 말해야 했나요?"
var end_wrong = "고쳐줘서 고마워요!"
var end_wrong_additive

$(document).ready(function(){
  initialize();

})

initialize = function(){
  $.ajax({
    url: '/chatbot/initialize',
    data:{
      "dialog_id": dialog_id,
    },
    dataType: 'json',
    success: function(data){
      cur_node = data.first_node
      cur_output = data.first_text
      chat_output()
      normal_function_buttons();

    },
    error: function(data){

    }
  })
}

retrieve_text = function(){
  $('#return').off('click')
  $('#wrong').off('click')
  $('#chat_input_text').off('keydown')
  cur_input = $("#chat_input_text").val()
  $("#chat_input_text").val('')
  chat_input();
  $.ajax({
    url: '/chatbot/retrieve_text',
    data:{
      'dialog_id': dialog_id,
      'input' : cur_input,
      'cur_node' : cur_node,
      'is_first' : is_first
    },
    dataType: 'json',
    success: function(data){
      cur_output = data.next_node_text;
      cur_node = data.next_node_id;

      //if initializing, make it not init after
      if(is_first){
        is_first = false;
      }

      //append output
      chat_output();
      console.log(practice)
      if(!data.end){
        normal_function_buttons();
      }
      if(data.practice){
        practice = data.practice
      }


    },
    error: function(data){

    }
  })
}
// append chat input in the chat interface
chat_input = function(input = cur_input){
  $("#chat_display_container").append("<div class='user_input'>"+input+"</div>")
  scroll_adjust();
}
//append chat output in the chat interface
chat_output = function(output = cur_output){
  output = josa_change(output)
  var output_split = output.split("/n")
  for(var i=0; i<output_split.length; i++){
      $("#chat_display_container").append("<div class='chatbot_output'>"+output_split[i]+"</div>")
  }
  scroll_adjust();
}
//adjust scroll bar when chat is added
scroll_adjust = function(){
  $("#chat_display_container").scrollTop(function(){
    return $(this).prop("scrollHeight");
  })
}
//when chatbot says in wrong way
wrong_output = function(){
  chat_input(chat_input_wrong)
  chat_output(chat_output_wrong)
  $("#wrong").off("click").addClass("disabled")
  $("#chat_input_text").off("keydown").on("keydown", function(key){
    if(key.keyCode==13){
      wrong_and_return();
    }
  })
  $("#return").off("click").on("click", function(){
    wrong_and_return();
  })
}
//receive fixed output and go back to original current
wrong_and_return = function(){
  cur_input = $("#chat_input_text").val()
  $("#chat_input_text").val('')
  chat_input();
  $.ajax({
    url: '/chatbot/wrong_and_return',
    data:{
      "dialog_id": dialog_id,
      "cur_node" : cur_node,
    },
    dataType: 'json',
    success: function(data){
      cur_node = data.next_node_id;
      console.log(data.additive_utt)
      if(data.additive_utt!=undefined){
        chat_output(end_wrong+"/n"+data.additive_utt)
    }else{
      chat_output(end_wrong)
    }
    normal_function_buttons();
    },
    error: function(data){

    }
  })
}
// make send to return input to backend, and enable wrong button
normal_function_buttons = function(){
  $("#return").off("click").on('click', function(){
    retrieve_text();
  })
  $("#chat_input_text").off("keydown").on("keydown", function(key){
    if(key.keyCode==13){
      retrieve_text();
    }
  })
  if(!practice){
    $("#wrong").off("click").removeClass("disabled").on('click', function(){
      wrong_output();
    })
  }
}

josa_change = function(output){
  var i=0;
  while(output.indexOf('으로/로')>=0&& i<100){
    var rep = Josa.c(output[output.indexOf('으로/로')-1], '으로/로')
    output = output.replace('으로/로', rep)
    i++
  }
  i=0;
  while(output.indexOf('이/가')>=0&&i<100){
    var rep = Josa.c(output[output.indexOf('이/가')-1], '이/가')
    output = output.replace('이/가', rep)
    i++
  }
  i=0;
  while(output.indexOf('은/는')>=0&&i<100){
    var rep = Josa.c(output[output.indexOf('은/는')-1], '은/는')
    output = output.replace('은/는', rep)
    i++
  }
  i=0;
  while(output.indexOf('을/를')>=0&&i<100){
    var rep = Josa.c(output[output.indexOf('을/를')-1], '을/를')
    output = output.replace('을/를', rep)
    i++
  }
  return output
}
