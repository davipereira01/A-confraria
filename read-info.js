$('button.encode, button.decode').click(function(event) {
    event.preventDefault();
  });
  
  function showDecodeImage() {
    var file = document.querySelector('input[name=decodeFile]').files[0];
  
    previewImage(file, ".decode canvas", function() {
      $(".decode").fadeIn();
    });
  }
  
  function showEncodeImage() {
    var file = document.querySelector("input[name=baseFile]").files[0];
  
    $(".images .nulled").hide();
    $(".images .message").hide();
  
    previewImage(file, ".original canvas", function() {
      $(".images .original").fadeIn();
      $(".images").fadeIn();
    });
  }
  
  function previewImage(file, canvasSelector, callback) {
    var reader = new FileReader();
    var image = new Image;
    var $canvas = $(canvasSelector);
    var context = $canvas[0].getContext('2d');
  
    if (file) {
      reader.readAsDataURL(file);
    }
  
    reader.onloadend = function () {
      image.src = URL.createObjectURL(file);
  
      image.onload = function() {
        $canvas.prop({
          'width': image.width,
          'height': image.height
        });
  
        context.drawImage(image, 0, 0);
  
        callback();
      }
    }
  }
  
  function hideMessage() {
    $(".error").hide();
    $(".binary").hide();
  
    var text = $("textarea.message").val();
  
    var $originalCanvas = $('.original canvas');
    var $nulledCanvas = $('.nulled canvas');
    var $messageCanvas = $('.message canvas');
  
    var originalContext = $originalCanvas[0].getContext("2d");
    var nulledContext = $nulledCanvas[0].getContext("2d");
    var messageContext = $messageCanvas[0].getContext("2d");
  
    var width = $originalCanvas[0].width;
    var height = $originalCanvas[0].height;
  
   
    if ((text.length * 8) > (width * height * 3)) {
      $(".error")
        .text("Esse texto é longo demais para essa imagem")
        .fadeIn();
  
      return;
    }
  
    $nulledCanvas.prop({
      'width': width,
      'height': height
    });
  
    $messageCanvas.prop({
      'width': width,
      'height': height
    });
  

    var original = originalContext.getImageData(0, 0, width, height);
    var pixel = original.data;
    for (var i = 0, n = pixel.length; i < n; i += 4) {
      for (var offset =0; offset < 3; offset ++) {
        if(pixel[i + offset] %2 != 0) {
          pixel[i + offset]--;
        }
      }
    }
    nulledContext.putImageData(original, 0, 0);
  
    
    var binMessage = "";
    for (i = 0; i < text.length; i++) {
      var binaryChar = text[i].charCodeAt(0).toString(2);
  
    
      while(binaryChar.length < 8) {
        binaryChar = "0" + binaryChar;
      }
  
      binMessage += binaryChar;
    }
    $('.binary textarea').text(binMessage);
  
   
    var message = nulledContext.getImageData(0, 0, width, height);
    pixel = message.data;
    counter = 0;
    for (var i = 0, n = pixel.length; i < n; i += 4) {
      for (var offset =0; offset < 3; offset ++) {
        if (counter < binMessage.length) {
          pixel[i + offset] += parseInt(binMessage[counter]);
          counter++;
        }
        else {
          break;
        }
      }
    }
    messageContext.putImageData(message, 0, 0);
  
    $(".binary").fadeIn();
    $(".images .nulled").fadeIn();
    $(".images .message").fadeIn();
  };
  
  function decodeMessage() {
    var $originalCanvas = $('.decode canvas');
    var originalContext = $originalCanvas[0].getContext("2d");
  
    var original = originalContext.getImageData(0, 0, $originalCanvas.width(), $originalCanvas.height());
    var binMessage = "";
    var pixel = original.data;
    for (var i = 0, n = pixel.length; i < n; i += 4) {
      for (var offset =0; offset < 3; offset ++) {
        var value = 0;
        if(pixel[i + offset] %2 != 0) {
          value = 1;
        }
  
        binMessage += value;
      }
    }
  
    var output = "";
    for (var i = 0; i < binaryMessage.length; i += 8) {
      var c = 0;
      for (var j = 0; j < 8; j++) {
        c <<= 1;
        c |= parseInt(binaryMessage[i + j]);
      }
  
      output += String.fromCharCode(c);
    }
  
    $('.binary-decode textarea').text(output);
    $('.binary-decode').fadeIn();
  };


  
      
  
    
      
        
  
        
      
    




