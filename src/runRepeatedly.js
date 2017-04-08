const runRepeatedly = ({ fn, until, now, args }) => {
  let operations = 0
  let pureTime = 0
  let fullTime = 0
  const startTime = now()

  while (true) { // eslint-disable-line no-constant-condition
    const before = now()
    fn(...args)
    const after = now()

    const runTime = after - before

    pureTime += runTime
    operations += 1
    fullTime = after - startTime

    if (!until(operations, fullTime, pureTime)) {
      break
    }
  }

  return { operations, pureTime, fullTime }
}

export default runRepeatedly
