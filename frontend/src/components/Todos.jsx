import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Input,
    InputGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Heading,
    Spacer,
    ButtonGroup,
    useDisclosure
} from "@chakra-ui/react";
import {AddIcon, CheckIcon, CloseIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons"

const TodosContext = React.createContext({
    todos: [], fetchTodos: () => {}
  })

  let id = () => {
    return Math.floor((1 + Math.random()) * 0x10000);
  }

function AddTodo() {
    const [item, setItem] = React.useState("")
    const {fetchTodos} = React.useContext(TodosContext)

    const handleInput = event  => {
        setItem(event.target.value)
      }
      
      const handleSubmit = (event) => {
        const newTodo = {
          "id": id(),
          "item": item
        }
      
        if(item !== "") {
            fetch("http://localhost:8000/todo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTodo)
              }).then(fetchTodos)
        }
        setItem("");
      }

      return (
        <form onSubmit={handleSubmit}>
            <Box m="auto" w="50%">
            <Flex minWidth='max-content' alignItems='center' paddingY="0.5rem">
                <InputGroup size="md">
                    <Input
                    value={item}
                    pr="4.5rem"
                    mr="0.5rem"
                    type="text"
                    placeholder="Add a todo item"
                    aria-label="Add a todo item"
                    onChange={handleInput}
                    />
                </InputGroup>
                <AddIcon cursor="pointer" onClick={handleSubmit} border="2px solid #e2e8f0" backgroundColor="#e2e8f0" borderRadius="var(--chakra-radii-md)" color="#000" p="6px" m="2px" w={9} h={9} type="submit" value="Submit">Add</AddIcon>
            </Flex>
          </Box>
        </form>
      )
      
}

function UpdateTodo({item, id}) {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [todo, setTodo] = useState(item)
    const {fetchTodos} = React.useContext(TodosContext)
    const updateTodo = async () => {
        await fetch(`http://localhost:8000/todo/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ item: todo })
        })
        onClose()
        await fetchTodos()
      }

      return (
        <>
          <Box title="Edit Task">
            <EditIcon cursor="pointer" border="2px solid blue" borderRadius="var(--chakra-radii-md)" color="blue" p="6px" m="2px" w={9} h={9} onClick={onOpen}>Update Todo</EditIcon>
          </Box>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
              <ModalHeader>Update Todo</ModalHeader>
              <ModalCloseButton/>
              <ModalBody>
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type="text"
                    placeholder="Add a todo item"
                    aria-label="Add a todo item"
                    value={todo}
                    onChange={event => setTodo(event.target.value)}
                  />
                </InputGroup>
              </ModalBody>
      
              <ModalFooter>
                <Button border="2px solid blue" color="blue" onClick={updateTodo}>Update Todo</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}

function DeleteTodo({id}) {
    const {fetchTodos} = React.useContext(TodosContext)
  
    const deleteTodo = async () => {
      await fetch(`http://localhost:8000/todo/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: { "id": id }
      })
      await fetchTodos()
    }
  
    return (
        <Box title="Delete Task">
            <DeleteIcon cursor="pointer" border="2px solid red" borderRadius="var(--chakra-radii-md)" color="red" p="6px" m="2px" w={9} h={9} onClick={deleteTodo}>Delete Todo</DeleteIcon>
        </Box>
    )
  }

  function CheckTodo({id, isComplete}) {
    const {fetchTodos} = React.useContext(TodosContext)
    const checkTodo = async () => {
      await fetch(`http://localhost:8000/todo/complete/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: { "id": id }
      })
      await fetchTodos()
    }
  
    return (
        <Box title="Checked or Unchecked Task">
            {!isComplete ? 
            <CheckIcon cursor="pointer" border="2px solid green" borderRadius="var(--chakra-radii-md)" color="green" p="6px" m="2px" w={9} h={9} onClick={checkTodo}/> :
            <CloseIcon cursor="pointer" border="2px solid green" borderRadius="var(--chakra-radii-md)" color="green" p="6px" m="2px" w={9} h={9} onClick={checkTodo}/>}
        </Box>
    )
  }

function TodoHelper({item, id, fetchTodos, isComplete}) {
    return (
        <Flex border="1px solid #e2e8f0" backgroundColor={isComplete && "#e2e8f0"} borderRadius="var(--chakra-radii-md)" minWidth='max-content' alignItems='center' gap='2' padding="0.5rem">
            <Box p='2'>
                {isComplete === true ? 
                <s><Heading size='md'>{item}</Heading></s> :
                <Heading size='md'>{item}</Heading> }
            </Box>
            <Spacer />
            <ButtonGroup gap='2'>
                <UpdateTodo item={item} id={id} fetchTodos={fetchTodos}/>
                <CheckTodo id={id} isComplete={isComplete} fetchTodos={fetchTodos}/>
                <DeleteTodo id={id} fetchTodos={fetchTodos}/>
            </ButtonGroup>
        </Flex>
    )
  }

export default function Todos() {
    const [todos, setTodos] = useState([])
    const fetchTodos = async () => {
        const response = await fetch("http://localhost:8000/todo")
        const todos = await response.json()
        setTodos(todos.data)
    }

    useEffect(() => {
        fetchTodos()
      }, [])
      
      return (
        <TodosContext.Provider value={{todos, fetchTodos}}>
            <AddTodo />
            <Stack m="auto" w="50%">
            {
                todos.map((todo) => (
                <TodoHelper key={todo.id} item={todo.item} id={todo.id} isComplete={todo.isComplete} fetchTodos={fetchTodos} />
                ))
            }
            </Stack>
        </TodosContext.Provider>
      ) 
}

