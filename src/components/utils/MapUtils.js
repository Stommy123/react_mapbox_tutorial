const loadPosition = async () => {
  try {
    const position = await getCurrentPosition();
    return position
  } catch (error) {
    console.log(error)
  }
}

const getCurrentPosition = (options = {}) => {
  return new Promise((resolve, reject) => {
    navigator.getlocation.getCurrentPosition(resolve, reject, options)
  });
};

const sayHello = (args) => {
  console.log(args)
}

export {loadPosition, sayHello}
