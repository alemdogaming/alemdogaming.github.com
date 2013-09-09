var app = angular.module("RobertoGame", []);

app.controller("IndexController", function ($scope) {

    var games = [
        {
            id: 1,
            name: 'portal',
            src: 'img/portal.png',
            link: 'post.html?game=' + 'portal'
        },
        {
            id: 2,
            name: 'bomberman',
            src: 'img/bomberman.png',
            link: 'post.html?game=' + 'bomberman'
        },
        {
            id: 3,
            name: 'megaman x4',
            src: 'img/megamanx4.png',
            link: 'post.html?game=' + 'megamanx4'
        }
    ];

    $scope.gameName = '';
    $scope.isBoxVisible = true;

    $scope.games = buildPhotoSet(games);

    $scope.changeSource = function () {
        var now = (new Date()).getTime();

        for (var i = 0, length = $scope.photos.length   ; i < length ; i++) {
            var photo = $scope.photos[i];
            photo.src = photo.src.replace(/\d\./i, "1.");
        }

    };

    $scope.isName = function (game) {
        return (game.name.indexOf($scope.gameName) != -1);
    }

    function buildPhotoSet(list) {
        var photos = [];
        var now = (new Date()).getTime();

        for (var i = 0, j = list.length ; i < j ; i++) {
            var index = ((i % 3) + 1);
            var version = (now + i);
            photos.push(list[i]);
        }
        return (photos);
    }

});


//LazyLoad de imagens
app.directive("bnLazySrc", function ($window, $document) {
    var lazyLoader = (function () {
        var images = [];
        var renderTimer = null;
        var renderDelay = 100;

        var win = $($window);
        var doc = $document;
        var documentHeight = doc.height();
        var documentTimer = null;
        var documentDelay = 2000;

        var isWatchingWindow = false;


        function addImage(image) {
            images.push(image);

            if (!renderTimer) {
                startRenderTimer();
            }

            if (!isWatchingWindow) {
                startWatchingWindow();
            }

        }

        function removeImage(image) {
            for (var i = 0, length = images.length ; i < length ; i++) {
                if (images[i] === image) {
                    images.splice(i, 1);
                    break;
                }
            }

            if (!images.length) {
                clearRenderTimer();
                stopWatchingWindow();
            }
        }

        function checkDocumentHeight() {

            if (renderTimer) {
                return;
            }

            var currentDocumentHeight = doc.height();

            if (currentDocumentHeight === documentHeight) {
                return;
            }

            documentHeight = currentDocumentHeight;

            startRenderTimer();

        }


        // I check the lazy-load images that have yet to
        // be rendered.
        function checkImages() {

            // Log here so we can see how often this
            // gets called during page activity.
            console.log("Checking for visible images...");

            var visible = [];
            var hidden = [];

            // Determine the window dimensions.
            var windowHeight = win.height();
            var scrollTop = win.scrollTop();

            // Calculate the viewport offsets.
            var topFoldOffset = scrollTop;
            var bottomFoldOffset = (topFoldOffset + windowHeight);

            // Query the DOM for layout and seperate the
            // images into two different categories: those
            // that are now in the viewport and those that
            // still remain hidden.
            for (var i = 0 ; i < images.length ; i++) {

                var image = images[i];

                if (image.isVisible(topFoldOffset, bottomFoldOffset)) {

                    visible.push(image);

                } else {

                    hidden.push(image);

                }

            }

            // Update the DOM with new image source values.
            for (var i = 0 ; i < visible.length ; i++) {

                visible[i].render();

            }

            // Keep the still-hidden images as the new
            // image queue to be monitored.
            images = hidden;

            // Clear the render timer so that it can be set
            // again in response to window changes.
            clearRenderTimer();

            // If we've rendered all the images, then stop
            // monitoring the window for changes.
            if (!images.length) {

                stopWatchingWindow();

            }

        }


        // I clear the render timer so that we can easily
        // check to see if the timer is running.
        function clearRenderTimer() {

            clearTimeout(renderTimer);

            renderTimer = null;

        }


        // I start the render time, allowing more images to
        // be added to the images queue before the render
        // action is executed.
        function startRenderTimer() {

            renderTimer = setTimeout(checkImages, renderDelay);

        }


        // I start watching the window for changes in dimension.
        function startWatchingWindow() {

            isWatchingWindow = true;

            // Listen for window changes.
            win.on("resize.bnLazySrc", windowChanged);
            win.on("scroll.bnLazySrc", windowChanged);

            // Set up a timer to watch for document-height changes.
            documentTimer = setInterval(checkDocumentHeight, documentDelay);

        }


        // I stop watching the window for changes in dimension.
        function stopWatchingWindow() {

            isWatchingWindow = false;

            // Stop watching for window changes.
            win.off("resize.bnLazySrc");
            win.off("scroll.bnLazySrc");

            // Stop watching for document changes.
            clearInterval(documentTimer);

        }


        // I start the render time if the window changes.
        function windowChanged() {

            if (!renderTimer) {

                startRenderTimer();

            }

        }


        // Return the public API.
        return ({
            addImage: addImage,
            removeImage: removeImage
        });

    })();

    function LazyImage(element) {

        var source = null;
        var isRendered = false;
        var height = null;

        function isVisible(topFoldOffset, bottomFoldOffset) {
            if (!element.is(":visible")) {
                return (false);
            }
            if (height === null) {
                height = element.height();
            }

            var top = element.offset().top;
            var bottom = (top + height);

            return (((top <= bottomFoldOffset) && (top >= topFoldOffset)) ||
                    ((bottom <= bottomFoldOffset) && (bottom >= topFoldOffset)) ||
                    ((top <= topFoldOffset) && (bottom >= bottomFoldOffset)));
        }

        function render() {
            isRendered = true;
            renderSource();
        }

        function setSource(newSource) {
            source = newSource;
            if (isRendered) {
                renderSource();
            }
        }

        function renderSource() {
            element[0].src = source;
        }

        return ({
            isVisible: isVisible,
            render: render,
            setSource: setSource
        });

    }

    function link($scope, element, attributes) {

        var lazyImage = new LazyImage(element);

        lazyLoader.addImage(lazyImage);

        attributes.$observe("bnLazySrc", function (newSource) {
            lazyImage.setSource(newSource);
        });

        $scope.$on("$destroy", function () {
            lazyLoader.removeImage(lazyImage);
        });

    }

    return ({
        link: link,
        restrict: "A"
    });

});