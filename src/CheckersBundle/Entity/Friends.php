<?php

    namespace CheckersBundle\Entity;

    use CheckersBundle\Utility\EntityBase;
    use \DateTime;

    class Friends extends EntityBase {
        private $users;
        private $friend;
        private $deleted;
        private $createdOn;

        public function getId()
        {
            return $this->id;
        }

        public function setId($id)
        {
            $this->id = $id;
        }

        /**
         * @return mixed
         */
        public function getUsers()
        {
            return $this->users;
        }

        /**
         * @param mixed $users
         */
        public function setUsers(Users $users)
        {
            $this->users = $users;
        }

        /**
         * @return mixed
         */
        public function getFriend()
        {
            return $this->friend;
        }

        /**
         * @param mixed $friend
         */
        public function setFriend(Users $friend)
        {
            $this->friend = $friend;
        }

        /**
         * @return mixed
         */
        public function getDeleted()
        {
            return $this->deleted;
        }

        /**
         * @param mixed $deleted
         */
        public function setDeleted($deleted)
        {
            $this->deleted = $deleted;
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
    }
