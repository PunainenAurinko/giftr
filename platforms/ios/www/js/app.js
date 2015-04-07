//tonk0006_giftr.js

var tonk0006_giftr = {
    loadRequirements: 0,
    init: function () {
        document.addEventListener('deviceready', this.onDeviceReady);
        document.addEventListener('DOMContentLoaded', this.onDomReady);
    },
    onDeviceReady: function () {
        //alert("Device is ready");
//        tonk0006_giftr.loadRequirements++;
//        if (tonk0006_giftr.loadRequirements === 2) {
            tonk0006_giftr.start();
//        }
    },
    onDomReady: function () {
        //alert("DOM is ready");
//        tonk0006_giftr.loadRequirements++;
//        if (tonk0006_giftr.loadRequirements === 2) {
            tonk0006_giftr.start();
//        }
    },
    start: function () {
        //connect to database
        //build the lists for the main pages based on data
        //add button and navigation listeners

        tonk0006_giftr.displayPeoplePage();
                
        var addButtons = document.querySelectorAll('.btnAdd');
        addButtons[0].addEventListener('click', tonk0006_giftr.openNewPersonModal);
        addButtons[1].addEventListener('click', tonk0006_giftr.openNewOccasionModal);
        addButtons[2].addEventListener('click', tonk0006_giftr.openNewGiftForPersonModal);
        addButtons[3].addEventListener('click', tonk0006_giftr.openNewGiftForOccasionModal);

        var cancelButtons = document.querySelectorAll('.btnCancel');
        cancelButtons[0].addEventListener('click', tonk0006_giftr.displayPeoplePage);
        cancelButtons[1].addEventListener('click', tonk0006_giftr.displayOccasionsPage);
        cancelButtons[2].addEventListener('click', tonk0006_giftr.displayGiftsForPeoplePage);
        cancelButtons[3].addEventListener('click', tonk0006_giftr.displayGiftsForOccasionsPage);
        
        var saveButtons = document.querySelectorAll('.btnSave');
        saveButtons[0].addEventListener('click', tonk0006_giftr.savePerson);
        saveButtons[1].addEventListener('click', tonk0006_giftr.saveOccasion);
        saveButtons[2].addEventListener('click', tonk0006_giftr.saveItem);
        saveButtons[3].addEventListener('click', tonk0006_giftr.saveItem);
        
        document.querySelector('header').addEventListener('click', tonk0006_giftr.displayPeoplePage);
                
        var list = document.querySelectorAll('[data-role="listview"]');
        var hm = new Hammer.Manager(list);

        var singleTap = new Hammer.Tap({
            event: 'singletap'
        });
        
        var doubleTap = new Hammer.Tap({
            event: 'doubletap',
            taps: 2,
            threshold: 10,
            posThreshold: 40
        });
        
        hm.add([singleTap, doubleTap]);
        doubleTap.requireFailure(singleTap);
        
        hm[0].on('singletap', tonk0006_giftr.displayGiftsForPeoplePage);
        hm[1].on('singletap', tonk0006_giftr.displayGiftsForOccasionsPage);
        hm.on('doubletap', tonk0006_giftr.deleteListItem);
//
//        var swipeLeft = new Hammer.Tap({
//            event: 'swipeleft'
//        });
//        var swipeRight = new Hammer.Tap({
//            event: 'swiperight'
//        });
        
        var goToPeople = new Hammer(document.querySelector('[data-role=page]#occasion-list'));
        goToPeople.on('swiperight', tonk0006_giftr.displayPeoplePage);
        
        var goToOccassions = new Hammer(document.querySelector('[data-role=page]#people-list'));
        goToOccassions.on('swipeleft', tonk0006_giftr.displayOccasionsPage);

        
        
        
        
        

//        var newPersonModal = new Hammer(document.querySelector('#people-list .btnAdd'));
//        newPersonModal.on('singletap', tonk0006_giftr.openNewPersonModal);
//
//        var newOccasionnModal = new Hammer(document.querySelector('#occasion-list .btnAdd'));
//        newOccasionnModal.on('singletap', tonk0006_giftr.openNewOccasionModal);
//        
//        var cancelPersonModal = new Hammer(document.querySelector('#add-person .btnCancel'));
//        cancelPersonModal.on('singletap', tonk0006_giftr.displayPeoplePage);
//        
//        var cancelOccasionModal = new Hammer(document.querySelector('#add-occasion .btnCancel'));
//        cancelOccasionModal.on('singletap', tonk0006_giftr.displayOccasionsPage);
    },

    displayPeoplePage: function () {
        document.querySelector('[data-role=modal]#add-person').style.display = 'none';
        document.querySelector('[data-role=overlay]').style.display = 'none';
        document.querySelector('[data-role=page]#people-list').style.display = 'block';
        document.querySelector('[data-role=page]#occasion-list').style.display = 'none';
        document.querySelector('[data-role=page]#gifts-for-person').style.display = 'none';
        document.querySelector('[data-role=page]#gifts-for-occasion').style.display = 'none';
    },

    displayOccasionsPage: function () {
        document.querySelector('[data-role=modal]#add-occasion').style.display = 'none';
        document.querySelector('[data-role=overlay]').style.display = 'none';
        document.querySelector('[data-role=page]#people-list').style.display = 'none';
        document.querySelector('[data-role=page]#occasion-list').style.display = 'block';
        document.querySelector('[data-role=page]#gifts-for-person').style.display = 'none';
        document.querySelector('[data-role=page]#gifts-for-occasion').style.display = 'none';
    },
    
    displayGiftsForPeoplePage: function () {
        document.querySelector('[data-role=modal]#add-gift-per').style.display = 'none';
        document.querySelector('[data-role=overlay]').style.display = 'none';
        document.querySelector('[data-role=page]#people-list').style.display = 'none';
        document.querySelector('[data-role=page]#occasion-list').style.display = 'none';
        document.querySelector('[data-role=page]#gifts-for-person').style.display = 'block';
        document.querySelector('[data-role=page]#gifts-for-occasion').style.display = 'none';
    },
    
    displayGiftsForOccasionsPage: function () {
        document.querySelector('[data-role=modal]#add-gift-occ').style.display = 'none';
        document.querySelector('[data-role=overlay]').style.display = 'none';
        document.querySelector('[data-role=page]#people-list').style.display = 'none';
        document.querySelector('[data-role=page]#occasion-list').style.display = 'none';
        document.querySelector('[data-role=page]#gifts-for-person').style.display = 'none';
        document.querySelector('[data-role=page]#gifts-for-occasion').style.display = 'block';
    },

    openNewPersonModal: function () {
        console.log('Person modal window opened');
        document.querySelector('[data-role=modal]#add-person').style.display = 'block';
        document.querySelector('[data-role=overlay]').style.display = 'block';
        //document.querySelector('#new-per').value = '';
        var input = document.querySelector('#new-per');
        input.value = '';
        input.focus();
        input.addEventListener('keypress', function (ev) {
            ev.stopImmediatePropagation();
            if (ev.keyCode === 13) {
                ev.preventDefault();
                //console.log(ev);
                tonk0006_giftr.savePerson();
                input.blur();
            }
        });
    },

    openNewOccasionModal: function () {
        console.log('Occasion modal window opened');
        document.querySelector('[data-role=modal]#add-occasion').style.display = 'block';
        document.querySelector('[data-role=overlay]').style.display = 'block';
        var input = document.querySelector('#new-occ');
        input.value = '';
        input.focus();
        input.addEventListener('keypress', function (ev) {
            ev.stopImmediatePropagation();
            if (ev.keyCode === 13) {
                ev.preventDefault();
                tonk0006_giftr.saveOccasion();
                input.blur();
            }
        });
        
    },
    
    openNewGiftForPersonModal: function () {
        console.log('Gift for person modal window opened');
        document.querySelector('[data-role=modal]#add-gift-per').style.display = 'block';
        document.querySelector('[data-role=overlay]').style.display = 'block';
    },
    
    openNewGiftForOccasionModal: function () {
        console.log('Gift for occasion modal window opened');
        document.querySelector('[data-role=modal]#add-gift-occ').style.display = 'block';
        document.querySelector('[data-role=overlay]').style.display = 'block';
    },
    savePerson: function () {
        var ul = document.querySelectorAll('[data-role="listview"]');
        var li = document.createElement('li');
        var text = document.querySelector('#new-per').value;
        li.innerHTML = text;
        ul[0].appendChild(li);
        document.querySelector('[data-role=modal]#add-person').style.display = 'none';
        document.querySelector('[data-role=modal]#add-occasion').style.display = 'none';
        document.querySelector('[data-role=overlay]').style.display = 'none';
    },
    
    saveOccasion: function () {
        var ul = document.querySelectorAll('[data-role="listview"]');
        var li = document.createElement('li');
        var text = document.querySelector('#new-occ').value;
        li.innerHTML = text;
        ul[1].appendChild(li);
        document.querySelector('[data-role=modal]#add-person').style.display = 'none';
        document.querySelector('[data-role=modal]#add-occasion').style.display = 'none';
        document.querySelector('[data-role=overlay]').style.display = 'none';
    }
}

tonk0006_giftr.init();

//function test(){
//    alert("TEST");
//}