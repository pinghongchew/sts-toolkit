// Processing functions for different views

/**
 * LogToSecsOnly processing: Filters out unwanted log lines
 */
export function filterLogLines(input: string): string {
  // Define all keywords to filter out
  const filterKeywords = [
    'system byte',
    'preparing to send',
    'received seperate request',
    'tcp disconnected',
    'starting passive mode',
    'waiting for connection',
    'attempting to connect',
    'fail to connect',
    'attempting next connect',
    'tcp engine enabled',
    'tcp not connected',
    'socket accepted from',
    'tcp port connected',
    'hsms selected',
    'sending control message',
    'failed to bind',
    'passive wait failed',
    'wait t5 before next listen',
    'hsms port disabled',
    'socket is closed',
  ]

  const lines = input.split('\n')
  const filteredLines = lines.filter((line) => {
    const lowerLine = line.toLowerCase()
    // Return true if the line doesn't contain any of the filter keywords
    return !filterKeywords.some((keyword) => lowerLine.includes(keyword))
  })

  return filteredLines.join('\n')
}

/**
 * StsViewer processing: Converts ASCII hex to text
 */
export function convertStsToText(input: string): string {
  let textArray = input.split('"')
  textArray = removeUnwantedIndex(textArray)
  const textResult = buildStringFromArray(textArray)
  return convertAsciiHexToText(textResult)
}

function removeUnwantedIndex(input: string[]): string[] {
  for (let i = input.length - 1; 0 < i + 1; i--) {
    if ((input[i] as string).length == 0) {
      input.splice(i, 1)
    } else {
      const arrNewLine = (input[i] as string).split('\n')
      if (arrNewLine.length > 1) {
        input.splice(i, 1)
      }
    }
  }
  return input
}

function buildStringFromArray(input: string[]): string {
  let strOutput = ''
  for (const strItem of input) {
    strOutput = strOutput + strItem
  }
  return strOutput
}

function convertAsciiHexToText(input: string): string {
  input = input.replace(/\\x([0-9a-f]{2})/gi, function (_, pair) {
    return String.fromCharCode(parseInt(pair, 16))
  })
  return input
}
