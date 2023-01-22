import { fromObject, Observable } from '@nativescript/core'
import { startAccelerometerUpdates } from "@triniwiz/nativescript-accelerometer"


async function getMessage() {
    const response = await fetch(
          'https://icanhazdadjoke.com',
          {
              method: 'GET',
              headers: {
                  'Accept': 'text/plain'
              }
          }
      );
      const data = await response.text();
    return data
  }
  

export function SensorViewModel() {
  const viewModel = new Observable()
  viewModel.x = 10;
  viewModel.y = 20;
  viewModel.z = 30;
  viewModel.switch=0;
  viewModel.jokes=[];
  getMessage().then(data => viewModel.set('message', data))
  //pri svakoj promjeni položaja emulatora/uređaja poziva se dolje definirana 
  //funkcija s pomoću koje prikazujemo te promjene na ekranu 

  startAccelerometerUpdates(function(data) {
    
    viewModel.set('x', data.x)
    viewModel.set('y', data.y)
    viewModel.set('z', data.z)

    if(data.x<0.2 && data.x >-0.2){
        viewModel.switch=0
        viewModel.set('number', viewModel.switch);
    }
    if(data.x>0.3 && viewModel.switch==0){
        getMessage().then(data => {
            viewModel.set('message', data);
            viewModel.jokes.push(data);
            
        })
        viewModel.switch=1

    }

    if(data.x<-0.3 && viewModel.switch==0){
        viewModel.jokes.pop();
        var oldJoke = viewModel.jokes.slice(-1)
        viewModel.set('message', oldJoke);
        viewModel.switch=1


    }

  }, { sensorDelay: "ui" })

  viewModel.onTap = () => {
    getMessage().then(data => {
        viewModel.set('message', data);
        viewModel.jokes.push(data);
    })
  }
  viewModel.onTap2 = () => {
    viewModel.jokes.pop();
        var oldJoke = viewModel.jokes.slice(-1)
        viewModel.set('message', oldJoke);
  }
  return viewModel
}