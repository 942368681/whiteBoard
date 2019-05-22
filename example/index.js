import '../src/white-board';
window.oCanvas = window.WhiteBoard({
    "el": ".box",
    "toolBar": true,
    "zIndexInfo": [{
            "penType": "fountain-pen",
            "color": "#039be5",
            "page": 1,
            "size": 5,
            "zIndex": 2,
            "content": [
                /* {"path":"M416 208L416 207L423 207L433 207L445 207L457 206L471 204L483 202L490 202L500 200L508 200L515 199L521 197L528 196L532 195L538 194L545 193L552 192L559 191L568 190L574 189L583 187L590 186L594 186L599 185L601 185L601 184L602 184L603 184L604 184L605 184L607 184L609 183L611 182L612 182L614 182L615 181L618 180L619 180L621 180L624 180L627 180L629 180L631 178L632 178L633 178L635 177L636 176"}, */
                /* {"path":"M159 71L163 77L167 88L171 99L174 110L175 120L177 132L177 145L177 157L177 170L177 185L172 197L169 209L166 220L165 228L162 235L162 240L162 244L162 247L164 248L166 251L169 251L173 251L178 251L188 251L197 250L207 245L218 237L229 228L239 218L249 203L259 182L268 162L273 143L275 123L275 106L275 90L270 73L263 62L255 54L248 49L237 47L225 47L213 47L204 47L188 60L177 76L170 108L168 149L175 192L197 242L227 288L255 321L285 346L317 364L340 375L357 380L369 381L378 381L385 380L389 375L391 367L393 354L393 339L391 322L383 300L373 279L365 261L359 246L355 237L354 234L354 233L358 232L368 235L382 241L405 250L424 256L451 262L462 265L468 268L469 269L470 269L470 270"}, */
                /* {"path":"M362 84L358 84L356 84L352 84L348 87L345 94L342 105L342 116L342 126L345 138L352 155L360 170L371 189L384 206L398 221L413 236L438 255L465 271L494 285L529 294L561 300L588 300L615 300L637 296L658 282L671 271L687 246L698 223L706 198L707 181L707 166L707 153L700 140L694 133L688 127L684 124L677 123L670 123L659 123L642 126L622 141L610 155L604 170L598 194L598 214L598 233L600 248L608 268L619 289L629 299L642 309L653 314L660 314L668 314L673 314L678 313L684 306L688 302L689 299L689 298L689 296L689 295"} */
                /* [{"currentMidX":29,"currentMidY":30,"oldX":29,"oldY":30,"oldMidX":29,"oldMidY":30},{"currentMidX":26,"currentMidY":38,"oldX":29,"oldY":30,"oldMidX":29,"oldMidY":30},{"currentMidX":22,"currentMidY":53,"oldX":23,"oldY":47,"oldMidX":26,"oldMidY":38},{"currentMidX":23,"currentMidY":65,"oldX":22,"oldY":59,"oldMidX":22,"oldMidY":53},{"currentMidX":27,"currentMidY":73,"oldX":24,"oldY":71,"oldMidX":23,"oldMidY":65},{"currentMidX":41,"currentMidY":75,"oldX":31,"oldY":76,"oldMidX":27,"oldMidY":73}],
                [{"currentMidX":343,"currentMidY":217,"oldX":343,"oldY":217,"oldMidX":343,"oldMidY":217},{"currentMidX":343,"currentMidY":217,"oldX":343,"oldY":217,"oldMidX":343,"oldMidY":217},{"currentMidX":343,"currentMidY":217,"oldX":343,"oldY":217,"oldMidX":343,"oldMidY":217},{"currentMidX":343,"currentMidY":217,"oldX":343,"oldY":217,"oldMidX":343,"oldMidY":217},{"currentMidX":345,"currentMidY":220,"oldX":344,"oldY":218,"oldMidX":343,"oldMidY":217}], */
                {"path":[{"currentMidX":272,"currentMidY":92,"oldX":272,"oldY":92,"oldMidX":272,"oldMidY":92},{"currentMidX":271,"currentMidY":95,"oldX":272,"oldY":93,"oldMidX":272,"oldMidY":92},{"currentMidX":271,"currentMidY":99,"oldX":271,"oldY":97,"oldMidX":271,"oldMidY":95},{"currentMidX":270,"currentMidY":104,"oldX":271,"oldY":101,"oldMidX":271,"oldMidY":99},{"currentMidX":269,"currentMidY":110,"oldX":270,"oldY":107,"oldMidX":270,"oldMidY":104},{"currentMidX":268,"currentMidY":117,"oldX":268,"oldY":114,"oldMidX":269,"oldMidY":110},{"currentMidX":270,"currentMidY":124,"oldX":268,"oldY":120,"oldMidX":268,"oldMidY":117},{"currentMidX":276,"currentMidY":132,"oldX":273,"oldY":129,"oldMidX":270,"oldMidY":124},{"currentMidX":284,"currentMidY":136,"oldX":280,"oldY":135,"oldMidX":276,"oldMidY":132}],"canvasSettings":{"strokeStyle":"#039be5","lineWidth":5,"lineCap":"round","globalAlpha":1}},{"path":[{"currentMidX":438,"currentMidY":138,"oldX":438,"oldY":137,"oldMidX":438,"oldMidY":137},{"currentMidX":439,"currentMidY":141,"oldX":439,"oldY":139,"oldMidX":438,"oldMidY":138},{"currentMidX":441,"currentMidY":148,"oldX":440,"oldY":143,"oldMidX":439,"oldMidY":141},{"currentMidX":444,"currentMidY":157,"oldX":442,"oldY":153,"oldMidX":441,"oldMidY":148},{"currentMidX":447,"currentMidY":165,"oldX":446,"oldY":161,"oldMidX":444,"oldMidY":157},{"currentMidX":450,"currentMidY":172,"oldX":449,"oldY":169,"oldMidX":447,"oldMidY":165},{"currentMidX":455,"currentMidY":177,"oldX":452,"oldY":175,"oldMidX":450,"oldMidY":172}],"canvasSettings":{"strokeStyle":"#039be5","lineWidth":5,"lineCap":"round","globalAlpha":0.5}}
            ],
            "other": {
                img: [],
                audio: [],
                video: [],
                N2: []
            }
        },
        /* {
            "color": "#000",
            "page": 1,
            "size": 10,
            "zIndex": 1,
            "content": [
                {"path":"M398 136L398 138L407 149L422 157L443 169L464 180L488 192L509 206L528 216L541 223L555 233L562 239L568 243L573 247L573 248L574 249"},{"path":"M588 138L588 140L589 146L592 153L596 162L601 169L605 176L608 182L612 188L615 192L616 193L616 195L616 196"}
            ],
            "other": {}
        } */
    ],
    "watcher": {
        wait: 2000,
        cb: () => console.log('aaaaaaaa')
    }
});