/**
 * author: mdemo
 * Date: 13-9-5
 * Time: 下午3:36
 * Desc:
 */
(function(root){
    var currentUser = {};
    var wpo = new Firebase('https://yourname.firebaseio.com');
    var wikiList = wpo.child('wikiList');
    var wikis = wpo.child('wikis');
    var Wiki = function () {

    };
    var currentHash = location.hash;
    var login = function(){
        $('#email').hide();
        $('#password').hide();
        $('#login').hide();
        $('#userName').text(currentUser.email).show();
        $('#logout').show();
    };
    var logout = function(){
        $('#email').show();
        $('#password').show();
        $('#login').show();
        $('#userName').hide();
        $('#logout').hide();
    };
    var hashchange = function(hash){
         currentHash = hash.substring(1);
        wikis.child(currentHash).on('value',function(data){
            console.log('changed');
            if (!editor.is('edit')){
                editor.importFile(currentHash,data.val());
                editor.preview();
            }
        });
    };
    root.Wiki = Wiki;
    Wiki.auth = new FirebaseSimpleLogin(wpo, function(error, user) {
        if (error) {
            console.log(error);
        } else if (user) {
            currentUser = user;
            login();
        } else {
            currentUser = {};
            logout();
        }
    });
    Wiki.getCurrentUser = function(){
        return currentUser;
    };
    Wiki.init = function(){
        wikiList.on('child_added', function(snapshot) {
            console.log(snapshot.val());
            $("#wiki_list").append('<li><a href="#'+snapshot.val().name+'">'+snapshot.val().name+'</a></li>');
        });
        if(location.hash){
            hashchange(location.hash);
        }
        $(root).hashchange(function(){
            hashchange(location.hash);
        });
        editor.on('autosave',function(){
           if(currentHash){
               wikis.child(currentHash).set(editor.exportFile());
           }
        });
    };
    Wiki.addWiki = function(name){
        if(currentUser.email){
            wikiList.push({name:name});
            wikis.child(name).set('');
        }
        else{
            alert("请先登录");
        }
    };
})(window);
