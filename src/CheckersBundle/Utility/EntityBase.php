<?php
    namespace CheckersBundle\Utility;

    Abstract Class EntityBase {
        public $id = 6;

        public function getId()
        {
            return $this->id;
        }
    }