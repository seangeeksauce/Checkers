<?php
    namespace CheckersBundle\Entity;

    use CheckersBundle\Utility\EntityBase;
    use DateTime;

    class Game extends EntityBase {
        private $host;
        private $opponent;
        private $status;
        private $createdOn;
        private $publicGame;
        private $title;
        private $password;

        /**
         * @return mixed
         */
        public function getHost()
        {
            return $this->host;
        }

        public function getTitle()
        {
            return $this->title;
        }

        public function setTitle($title)
        {
            $this->title = $title;
        }

        /**
         * @param mixed $host
         */
        public function setHost(Users $host)
        {
            $this->host = $host;
        }

        /**
         * @return mixed
         */
        public function getOpponent()
        {
            return $this->opponent;
        }

        /**
         * @param mixed $opponent
         */
        public function setOpponent(Users $opponent = null)
        {
            $this->opponent = $opponent;
        }

        /**
         * @return mixed
         */
        public function getStatus()
        {
            return $this->status;
        }

        /**
         * @param mixed $status
         */
        public function setStatus($status)
        {
            $this->status = $status;
        }

        /**
         * @return mixed
         */
        public function getCreatedOn()
        {
            return $this->createdOn;
        }

        /**
         * @param mixed $createdOn
         */
        public function setCreatedOn(DateTime $createdOn)
        {
            $this->createdOn = $createdOn;
        }

        /**
         * @return mixed
         */
        public function getPublicGame()
        {
            return $this->publicGame;
        }

        /**
         * @param mixed $publicGame
         */
        public function setPublicGame($publicGame)
        {
            $this->publicGame = $publicGame;
        }

        /**
         * @return mixed
         */
        public function getPassword()
        {
            return $this->password;
        }

        /**
         * @param mixed $password
         */
        public function setPassword($password)
        {
            $this->password = $password;
        }
    }
