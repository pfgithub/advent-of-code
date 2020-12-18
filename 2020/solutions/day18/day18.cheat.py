class Cheat:
    def __init__(self, value):
        self.value = value
    def __str__(self):
        return "{0}".format(self.value)
    def __add__(self, other):
        return Cheat(self.value + other.value)
    def __sub__(self, other):
        return Cheat(self.value * other.value)
    def __mod__(self, other):
        return Cheat(self.value + other.value)

import sys
eval(sys.stdin.read())