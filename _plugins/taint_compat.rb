# Compatibility shim for Ruby 4 / liquid taint checks
# Jekyll 3.9 + Liquid 4 expects objects to respond to #tainted?
# Ruby 4 removed taint/untaint APIs from String/Array/etc.
# This file restores a no-op implementation so builds work.

class Object
  unless method_defined?(:tainted?)
    def tainted?
      false
    end
  end
end

class String
  unless method_defined?(:tainted?)
    def tainted?
      false
    end
  end
end

class Array
  unless method_defined?(:tainted?)
    def tainted?
      false
    end
  end
end

class Hash
  unless method_defined?(:tainted?)
    def tainted?
      false
    end
  end
end
