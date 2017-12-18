var cur_node;
var cur_output;
var cur_input='';
var is_first = true;

var practice = false;

var dialog_id = "0"
var chat_input_wrong = "잘못 말하고 있는 것 같아요"
var chat_output_wrong = "앗 실수해서 미안해요\n 어떻게 말해야 했나요?"
var end_wrong = "고쳐줘서 고마워요!"
var end_wrong_additive

var quiz_h
var quiz_a
var quiz_f

var id_button=0

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
      chat_output(normal_function_buttons)
      //normal_function_buttons();

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
      'is_first' : is_first,
      'practice' : practice,
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
      chat_output(retrieve_text_afteroutput,data);



    },
    error: function(data){

    }
  })
}
retrieve_text_afteroutput=function(data){
  console.log(practice)
  if(!data.end && !data.practice){
    normal_function_buttons();
  }else if(!data.end&&data.practice){
    set_quiz(data.quiz);
    //alert('practice begins')
  }
  if(data.practice){
    practice = data.practice
  }
}
// append chat input in the chat interface
chat_input = function(input = cur_input){
  if(!practice){
    $("#chat_display_container").append("<div class='user_input'>"+input+"</div>")
  }else{
    var quiz_input = ''
    for(var j=0; j<quiz_h.length; j++){
      quiz_input = quiz_input + " "+ $("#quiz_"+j.toString()).val()
      $("#quiz_"+j.toString()).val('')
    }
    $("#chat_display_container").append("<div class='user_input'>"+quiz_input+"</div>")
  }
  scroll_adjust();
}
//append chat output in the chat interface
chat_output = function(function_to_call=null, param=null,output = cur_output){
  console.log(param)
  output = josa_change(output)
  var output_split = output.split("/n")
  chat_render(output_split, function_to_call, param)

  //chat_render(output_split, function_to_call, param)

}
chat_render=function(output_split, function_to_call, param){
  //console.log(param)
  if(output_split.length!=0){
    $("<div class='chatbot_output' style='opacity:0'>chatbot is typing</div>").appendTo("#chat_display_container")
    .animate({
      opacity: 1}
      ,{
        duration : 1000,
        start : function(){
        scroll_adjust();
      },
      done : function(){
        console.log('done')
        var t = output_split.shift()
        $(this).text(t).attr("val", t)
        $(this).append("<button id='trans_"+id_button.toString()+"' class='trans_button btn btn-sm btn-secondary' data-toggle='tooltip'>Translate it!</button>")
        $('#trans_'+id_button.toString()).on("click", function(){
          $(this).text("translating...")
          var but_id = $(this).attr('id')
          $(this).off('click')
          $.ajax({
            url: '/chatbot/translate',
            data:{
              'sentence': $(this).parent().attr("val")
            },
            dataType: 'json',
            success: function(data){

              translated_sentence = data.translated//['message']['result']['translatedText']
              console.log(translated_sentence)
              translated_sentence = translated_sentence.replace(/&#39;/g,"'").replace(/&quot;/g,"'");
              $("#"+but_id).text("translated!").attr('title',translated_sentence)
              .tooltip('toggle')
            },
            error : function(data){

            }
          })
        })
        id_button++;
        chat_render(output_split, function_to_call, param)
      },
    })
  }else if(function_to_call!=null){
    if(param==null || param==undefined){
      function_to_call()
    }else{
      function_to_call(param)
    }
  }
    return;
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
  chat_output(wrong_output_after_output ,null,chat_output_wrong)

}

wrong_output_after_output=function(){
  $("#chat_input_text").replaceWith("<textarea id='chat_input_text'></textarea>")
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
        if(data.quiz==undefined){
          chat_output(normal_function_buttons,null,end_wrong+"/n"+data.additive_utt)
        }else{
          practice = true;
          chat_output(set_quiz,data.quiz,end_wrong+"/n"+data.additive_utt)
        }
      }else{
        if(data.quiz==undefined){
          chat_output(normal_function_buttons,null,end_wrong)
        }else{
          practice = true
          chat_output(set_quiz,data.quiz,end_wrong)
        }
      }
      //normal_function_buttons();
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
set_quiz=function(quiz){
  $('#return').off('click')
  //$('#wrong').off('click')
  if(!practice){
    $("#wrong").off("click").removeClass("disabled").on('click', function(){
      practice = false;
      wrong_output();
    })
  }else{
    $("#wrong").addClass("disabled")
  }
  $('#chat_input_text').off('keydown')
  $("#chat_input_text").replaceWith("<div id='chat_input_text'></div>")
//  $("#wrong").off('click').addClass("disabled")
  quiz_h = quiz['quiz_h'].split('/')
  quiz_a = quiz['quiz_a'].split('/')
  quiz_f = quiz['quiz_f'].split('/')
  for(var j=0; j<quiz_h.length; j++){
    $("#chat_input_text").append("<input id='quiz_"+j.toString()+"' class='form-control quiz_input' type='text' placeholder='"+quiz_h[j]+"'></input>")
  }
  $("#return").on("click", function(){
    gen_quiz(quiz_a);
  })
  $('#chat_input_text').on('keydown', function(key){
    if(key.keyCode == 13){
      gen_quiz(quiz_a);
    }
  })
}

gen_quiz = function(quiz_a){
  var feedback = ''
  for(var j=0; j<quiz_h.length; j++){
    if(quiz_a[j]!=$("#quiz_"+j.toString()).val().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ")){
      if(feedback!=''){
        feedback=feedback+"/n또, "+quiz_f[j]
      }else{
        feedback=quiz_f[j]
      }
    }
  }
  console.log(feedback)
  if(feedback.length==0){
    retrieve_text();
  }else{
    chat_input();
    chat_output(null,null, feedback);
  }
}
