import asyncio
import edge_tts

async def main():
    voices = await edge_tts.list_voices()
    us = [v['ShortName'] for v in voices if v['Locale'] == 'en-US']
    print("US voices:", us)

if __name__ == "__main__":
    asyncio.run(main())
