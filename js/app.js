  var app = angular.module('myApp', []);

app.controller('myController', function($scope, $rootScope, $http, $location) {
    $scope.formData = {};
    $scope.capi = [];
    $scope.datiSenzaSelectedClient = [];
    $scope.idCliente;
    $scope.showForm = false;
    $scope.showClientiEmpty = false;
    $scope.editDataFlag = false;
    $scope.updateCliente = false;
    $scope.showRitiroCapi = false;
    $scope.aggiungiCapoFlag = true;
    $scope.showFormCliente = false;


    $scope.config = {
            transformResponse: function(data, headers) {
            // Verifica se la risposta sembra essere una stringa JSON
                if (headers("Content-Type") === "application/json" || headers("Content-Type") === "application/json;charset=utf-8") {
            // Se la risposta è già in formato JSON, restituiscila così com'è
                    var jsonString;
                    var jsonObject;
                    if(data === "OK"){
                        jsonString = '{"risposta": "OK"}';
                        jsonObject = JSON.parse(jsonString);
                    }else if (data === "KO"){
                        jsonString = '{"risposta": "KO"}';
                        jsonObject = JSON.parse(jsonString);
                    }
                    
                    return angular.fromJson(jsonObject);
                } else {
                // Se la risposta non sembra essere JSON, tenta di interpretarla come JSON
                    try {
                        return angular.fromJson(data);
                    } catch (e) {
                    // Se non è possibile interpretare la risposta come JSON, restituisci un errore
                        throw new Error("Impossibile analizzare la risposta come JSON.");
                }
            }
        }
    };

    $scope.getFlagForForm = function(){
        $scope.showForm = !$scope.showForm;
        if($scope.showClientiEmpty){
            $scope.showClientiEmpty = !$scope.showClientiEmpty;
        }
        if($scope.editDataFlag){
            $scope.editDataFlag = !$scope.editDataFlag;
        }
        if($scope.updateCliente){
            $scope.updateCliente = !$scope.updateCliente;
        }
        $scope.getDataForPresaInCarico();
    };

    $scope.showFormUpdateCliente = function(idCliente){
        $scope.updateCliente = !$scope.updateCliente;
        $rootScope.id = idCliente;
        if($scope.showForm){
            $scope.showForm = !$scope.showForm;
        }
        if($scope.showClientiEmpty){
            $scope.showClientiEmpty = !$scope.showClientiEmpty;
        }
        if($scope.editDataFlag){
            $scope.editDataFlag = !$scope.editDataFlag;
        }
    };
    $scope.toggleSearch = function() {
        var input = document.querySelector('.search-input');
        input.style.display = (input.style.display === 'none') ? 'inline-block' : 'none';
        if (input.style.display === 'inline-block') {
            input.focus();
    }
  };
    $scope.printEtichettaCliente = function(idCliente){
        $http.get('http://192.168.1.228:8080/lavanderia/cliente?idCliente=' + idCliente)
            .then(function(response){
                console.log('Data received for print:', response.data);
                $scope.nome=response.data[0].nome;
                $scope.cognome=response.data[0].cognome;
                $scope.indirizzo=response.data[0].indirizzo;
                $scope.tel=response.data[0].numeroDiTelefono;
                var etichetta = $scope.nome + ' ' + $scope.cognome+'<br>'+$scope.indirizzo+'<br>'+$scope.tel;
                
                var win = window.open('', '_blank'); // Apre una finestra vuota
                win.document.write(etichetta); // Scrive il contenuto dell'etichetta nella finestra
                win.document.close(); // Chiude la scrittura
                win.print(); // Avvia l'azione di stampa

                // Attendi un po' prima di chiudere la finestra per consentire la stampa
                setTimeout(function(){
                    win.close(); // Chiude la finestra dopo un certo intervallo di tempo
                }, 500); // 500 millisecondi = mezzo secondo
        }, function(error){
               console.error('Error fetching data:', error);

        });
    };

    $scope.updateData = function(clienteDto){
            data = {nome:clienteDto.nome, 
            cognome:clienteDto.cognome, 
            indirizzo:clienteDto.indirizzo,
            numeroDiTelefono:clienteDto.numeroDiTelefono};
            $http.put('http://192.168.1.228:8080/lavanderia/cliente/' + $rootScope.id, JSON.stringify(data))
                .then(function(response) {
                    console.log('Data received:', response.data);
                    $window.location.reload();
                
            }, function(error) {
                console.error('Error fetching data:', error);
            });

    };
    $scope.getData = function() {
        $http.get('http://192.168.1.228:8080/lavanderia/clienti', $scope.config)
            .then(function(response) {
                console.log('Data received:', response.data);
                $scope.apiData = response.data;
                $scope.showClientiEmpty = !$scope.showClientiEmpty;
                if($scope.showForm){
                    $scope.showForm = !$scope.showForm;
                }
                if($scope.editDataFlag){
                    $scope.editDataFlag = !$scope.editDataFlag;
                }
                if($scope.updateCliente){
                    $scope.updateCliente = !$scope.updateCliente;
                }
            }, function(error) {
                console.error('Error fetching data:', error);
            });
    };

    $scope.getDataForPresaInCarico = function() {
        $http.get('http://192.168.1.228:8080/lavanderia/clienti', $scope.config)
            .then(function(response) {
                console.log('Data received:', response.data);
                $scope.datiClienti = response.data;
                $scope.showClientiEmpty = !$scope.showClientiEmpty;
            }, function(error) {
                console.error('Error fetching data:', error);
            });
    };
    $scope.getCliente = function(idCliente, nome, cognome) {
        $http.get('http://192.168.1.228:8080/lavanderia/cliente', {
            params:{
                idCliente: idCliente,
                nome: nome,
                cognome: cognome
            }
        })
            .then(function(response) {
                console.log('Data received:', response.data);
                $scope.apiData = response.data;
                $scope.showRitiroCapi = !$scope.showRitiroCapi;
                if($scope.showForm){
                    $scope.showForm = !$scope.showForm;
                }
                if($scope.editDataFlag){
                    $scope.editDataFlag = !$scope.editDataFlag;
                }
                if($scope.updateCliente){
                    $scope.updateCliente = !$scope.updateCliente;
                }
            }, function(error) {
                console.error('Error fetching data:', error);
            });
    };
    $scope.deleteData = function(id) {
        $http.delete('http://192.168.1.228:8080/lavanderia/cliente/' + id)
        .then(function(response) {
            location.reload();
            console.log('Resource deleted successfully');
    })
        .catch(function(error) {
            console.error('Error deleting resource:', error);
    });
    };


    $scope.sendData = function() {
        $http.post('http://192.168.1.228:8080/lavanderia/cliente', $scope.formData)
            .then(function(response) {
            console.log('Data sent successfully:', response.data);
            $window.location.reload();
        })
        .catch(function(error) {
            console.error('Error sending data:', error);
        });
    };

    $scope.sendCapi = function(){
        $scope.preparazioneDelDato();

    $http.post('http://192.168.1.228:8080/lavanderia/cliente/capo/' + $scope.idCliente, $scope.datiSenzaSelectedClient, $scope.config)
    .then(function(response){
        location.reload();
        console.log('Capo inserito con successo')
    }, function(error){
        console.error('Caricamento del capo fallito: ', error);
    });
};


    $scope.aggiungiCapo = function(capoDto){
        if (Object.keys(capoDto).length >= 3){
            $scope.capi.push(angular.copy(capoDto));
            $scope.aggiungiCapoFlag = !$scope.aggiungiCapoFlag;
        }
    };

    $scope.preparazioneDelDato = function(){
        $scope.idCliente = $scope.capi[0].selectedClient;
        $scope.datiSenzaSelectedClient = $scope.capi.map(function(capo) {
            return {
                nomeCapo: capo.nomeCapo,
                descrizione: capo.descrizione
        };
    });
    };

    $scope.mostraFormCliente = function(){
        $scope.showFormCliente = !$scope.showFormCliente;
    }

    $scope.aggiungiCliente = function(formCliente){

        $http.post('http://192.168.1.228:8080/lavanderia/cliente', formCliente, config)
        .then(function(response){
            location.reload();
            console.log('Cliente inserito con successo')
        }, function(error){
            console.error('Caricamento del cliente fallito: ', error);
    });
    }
});

