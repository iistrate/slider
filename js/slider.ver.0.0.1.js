/*
 * Slider
 */
function Slider(selector) {
    var LEFT = 0;
    var RIGHT = 1;

    var sliderContainer = document.querySelector(selector);

    //get nav
    var m_left = sliderContainer.querySelector('.left');
    var m_right = sliderContainer.querySelector('.right');
    var m_direction = LEFT;

    //current image is in [this selects the first image]
    var m_currentImage = sliderContainer.querySelector('.item');
    var m_next = m_currentImage.nextElementSibling;
    var m_prev = m_currentImage.previousElementSibling;

    //we'll apply our animation on this element
    var m_hidden = sliderContainer.querySelector('.items');
    var m_hidden_pos = 0;
    var m_navigating = false;


    var setupEvents = function() {
        //add onclick to left and right arrows
        m_left.addEventListener('click', goLeft, false);
        m_right.addEventListener('click', goRight, false);
    };

    var goLeft = function(e) {
        m_direction = RIGHT;
        if (m_prev && !m_navigating) {
            navigate();
        }
        e.preventDefault();
    }//goLeft

    var goRight = function(e) {
        m_direction = LEFT;
        if (m_next && !m_navigating) {
            navigate();
        }
        e.preventDefault();
    }//goRight

    var navigate = function() {
        m_navigating = true;
        var stepSize = 10;
        var stepDuration = 5;
        //get offset based on direction
        var totalOffset = m_direction == LEFT ? m_currentImage.clientWidth: m_prev.clientWidth;
        var stepHandler = setInterval(function () {
            //change stepsize in case we're going over (ex not a multiple of stepSize)
            stepSize = (totalOffset - stepSize) >= 0 ? stepSize : Math.abs((totalOffset - stepSize));
            if (totalOffset >= 0) {
                //go right or left
                m_hidden_pos = m_hidden_pos + ((m_direction === LEFT) ? -stepSize : stepSize);
                //apply margin
                m_hidden.style.marginLeft = m_hidden_pos + 'px';
                //counter
                totalOffset -= stepSize;
            }
            else {
                clearInterval(stepHandler);
                m_navigating = false;
            }
        }, stepDuration);
        m_currentImage = m_direction == LEFT ? m_currentImage.nextElementSibling : m_currentImage.previousElementSibling;
        //update next and prev
        m_next = m_currentImage.nextElementSibling;
        m_prev = m_currentImage.previousElementSibling;
        //
    }//navigate

    var paginate = function(starting) {
        var starting = starting || 0;
        //get items
        var items = sliderContainer.querySelectorAll(".items .item img");
        //how many can we fit in a page?
        //page width - (n*(image size width + margin))
        var pageWidth = sliderContainer.querySelector('.hidden').clientWidth;

        //paginate a whole row
        var paginating = true;
        var cursor = starting;
        //add .current to the left most image
        //addClass(items[starting].parentNode.parentNode, 'current');

        while (paginating && (cursor != items.length)) {
            if (pageWidth - items[cursor].clientWidth > 0) {
                pageWidth -= items[cursor].clientWidth;
                cursor++;
            }
            else {
                paginating = false;
            }
        }
        //at this point cursor holds the number of images for the first page
        //and pageWidth holds the available free space
        //it's time to distribute the margins
        margin = Math.ceil(pageWidth / cursor);
        for (var i = 0; i < cursor; i++) {
            items[i].parentNode.parentNode.style.marginRight = margin + 'px';
        }
    }//paginate

    this.init = function() {
        setupEvents();
    }

}